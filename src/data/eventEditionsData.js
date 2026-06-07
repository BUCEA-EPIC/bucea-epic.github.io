export const eventEditions = [
  {
    id: '5',
    edition: '第五届',
    title: '第五届萌新种子杯',
    shortTitle: '第五届',
    status: '已结束',
    route: '/event',
    awardsRoute: '/event/5/awards',
    schedule: '11月26日（周三）至12月15日（周一）',
    description: '第五届“萌新种子杯”已结束，欢迎查看赛道介绍、命题文档与获奖公示。',
    ctaLabel: '查看第五届',
    tracks: [
      '视觉循迹仿真赛道',
      '开关电源设计赛道',
      '三维建模设计赛道'
    ]
  },
  {
    id: '6',
    edition: '第六届',
    title: '第六届萌新种子杯',
    shortTitle: '第六届',
    status: '筹备中',
    route: '/event/6',
    awardsRoute: '',
    schedule: '赛程待公布',
    description: '第六届“萌新种子杯”正在筹备中，后续将陆续公布报名、赛道、培训与比赛安排。',
    ctaLabel: '查看第六届',
    tracks: [
      '视觉循迹仿真赛道',
      '开关电源设计赛道',
      '三维建模设计赛道'
    ],
    sections: [
      {
        title: '赛事安排',
        content: '第六届赛事安排将以正式通知为准。页面会同步更新报名时间、培训时间、比赛时间和作品提交要求。'
      },
      {
        title: '赛道设置',
        content: '赛道设置将延续工程实践与创新训练导向，具体赛题、规则和评分标准将在命题文档发布后同步更新。'
      },
      {
        title: '报名与咨询',
        content: '报名入口和咨询方式将在赛事启动后公布。请关注工作室官网与赛事通知，及时获取最新安排。'
      },
      {
        title: '结果公示',
        content: '第六届赛事结束后，将在独立页面公示获奖名单，避免与第五届公示内容混淆。'
      }
    ],
    timeline: [
      '赛事通知发布',
      '开放报名',
      '赛前培训',
      '正式比赛',
      '获奖公示'
    ]
  }
]

export const currentEventEdition = eventEditions[0]

export const getEventEditionById = (id) =>
  eventEditions.find((edition) => edition.id === String(id))
