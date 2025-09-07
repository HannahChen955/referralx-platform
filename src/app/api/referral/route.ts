import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { sendQuickScreeningEmail, sendFormalReferralEmail } from '@/lib/email-service'
import { desensitizeForQuickScreening } from '@/lib/data-sensitivity'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const jobId = formData.get('jobId') as string
    const userId = formData.get('userId') as string
    const candidateName = formData.get('candidateName') as string
    const candidatePhone = formData.get('candidatePhone') as string
    const candidateEmail = formData.get('candidateEmail') as string
    const reason = formData.get('reason') as string
    const isAnonymous = formData.get('isAnonymous') === 'true'
    const resumeFile = formData.get('resume') as File
    
    // 双层推荐流程新增字段
    const referralType = formData.get('referralType') as 'QUICK_SCREENING' | 'FORMAL' || 'FORMAL'
    const isDesensitized = formData.get('isDesensitized') === 'true'
    
    // 快速初筛专用字段
    const industry = formData.get('industry') as string
    const experience = formData.get('experience') as string
    const skills = formData.get('skills') as string
    const education = formData.get('education') as string
    const location = formData.get('location') as string

    // 根据推荐类型进行不同的验证
    if (referralType === 'QUICK_SCREENING') {
      // 快速初筛验证
      if (!jobId || !userId || !industry || !experience || !skills || !reason) {
        return NextResponse.json(
          { 
            success: false, 
            error: '请填写所有必填信息' 
          },
          { status: 400 }
        )
      }
    } else {
      // 正式推荐验证
      if (!jobId || !userId || !candidateName || !candidatePhone || !reason) {
        return NextResponse.json(
          { 
            success: false, 
            error: '请填写所有必填信息' 
          },
          { status: 400 }
        )
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(candidatePhone)) {
        return NextResponse.json(
          { 
            success: false, 
            error: '请输入正确的候选人手机号' 
          },
          { status: 400 }
        )
      }
    }

    // 检查是否已推荐过该候选人（仅对正式推荐进行检查）
    if (referralType === 'FORMAL' && candidatePhone) {
      const existingReferral = await prisma.referral.findUnique({
        where: {
          jobId_candidatePhone: {
            jobId,
            candidatePhone
          }
        }
      })

      if (existingReferral) {
        return NextResponse.json(
          { 
            success: false, 
            error: '该候选人已被推荐过此职位' 
          },
          { status: 409 }
        )
      }
    }

    // 验证职位是否存在且有效
    const job = await prisma.job.findUnique({
      where: { id: jobId, isActive: true }
    })

    if (!job) {
      return NextResponse.json(
        { 
          success: false, 
          error: '职位不存在或已下线' 
        },
        { status: 404 }
      )
    }

    // 验证用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: '用户不存在，请重新登录' 
        },
        { status: 401 }
      )
    }

    // 处理简历文件上传（这里简化处理，实际项目中应该上传到云存储）
    let resumeFileName: string | null = null
    let resumeFileUrl: string | null = null
    
    if (resumeFile && resumeFile.size > 0) {
      resumeFileName = resumeFile.name
      // 在实际项目中，这里应该上传到云存储服务
      resumeFileUrl = `/uploads/resumes/${Date.now()}-${resumeFile.name}`
    }

    // 创建推荐记录
    const referral = await prisma.referral.create({
      data: {
        jobId,
        userId,
        candidateName: candidateName || '候选人',
        candidatePhone: candidatePhone || '',
        candidateEmail: candidateEmail || null,
        reason,
        isAnonymous,
        resumeFileName,
        resumeFileUrl,
        status: 'SUBMITTED',
        // 新增字段
        referralType,
        isDesensitized,
        emailSentAt: new Date()
      },
      include: {
        job: {
          select: {
            title: true,
            company: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    })

    // 创建初始进度记录
    await prisma.referralProgress.create({
      data: {
        referralId: referral.id,
        stage: 'SUBMITTED',
        notes: '推荐已提交，等待HR审核',
        rewardAmount: 0
      }
    })

    // 根据推荐类型发送不同的邮件
    try {
      if (referralType === 'QUICK_SCREENING') {
        // 发送快速初筛邮件
        const quickScreeningData = {
          referralId: referral.id,
          userName: referral.user.name || '匿名用户',
          jobTitle: referral.job.title,
          company: referral.job.company,
          candidateInfo: {
            industry,
            experience,
            skills,
            education,
            location,
            matchReason: isDesensitized ? desensitizeForQuickScreening(reason) : reason
          }
        }
        
        const emailResult = await sendQuickScreeningEmail(quickScreeningData)
        console.log('快速初筛邮件发送结果:', emailResult)
      } else {
        // 发送正式推荐邮件
        const formalReferralData = {
          referralId: referral.id,
          userName: referral.user.name || '匿名用户',
          jobTitle: referral.job.title,
          company: referral.job.company,
          candidateInfo: {
            name: candidateName,
            phone: candidatePhone,
            email: candidateEmail || undefined,
            experience: experience || undefined,
            skills: skills || undefined,
            education: education || undefined,
            matchReason: reason
          }
        }
        
        const emailResult = await sendFormalReferralEmail(formalReferralData)
        console.log('正式推荐邮件发送结果:', emailResult)
      }
    } catch (emailError) {
      console.error('邮件发送失败:', emailError)
      // 邮件发送失败不影响推荐记录的创建，只记录错误日志
    }

    return NextResponse.json({
      success: true,
      data: {
        referral: {
          id: referral.id,
          candidateName: referral.candidateName,
          jobTitle: referral.job.title,
          company: referral.job.company,
          status: referral.status,
          createdAt: referral.createdAt,
          referralType: referral.referralType
        }
      }
    })

  } catch (error) {
    console.error('创建推荐失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '提交推荐失败，请重试' 
      },
      { status: 500 }
    )
  }
}