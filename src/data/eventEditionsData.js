export const eventEditions = [
  {
    id: '5',
    edition: '第五届',
    title: '第五届萌新种子杯',
    shortTitle: '第五届',
    status: '已结束',
    route: '/event/5',
    awardsRoute: '/event/5/awards',
    schedule: '2025年11月26日（周三）至12月15日（周一）',
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
    description: '第六届“萌新种子杯”正在筹备中，报名、赛道与比赛安排将后续公布。',
    ctaLabel: '查看第六届',
    tracks: [
      '视觉循迹仿真赛道',
      '开关电源设计赛道',
      '三维建模设计赛道'
    ],
    sections: [
      {
        title: '报名安排',
        content: '报名入口和报名时间将在赛事启动后公布，请关注后续通知。'
      },
      {
        title: '赛道设置',
        content: '赛道方向和命题文档将在赛事启动后同步更新。'
      }
    ]
  }
]

export const currentEventEdition = eventEditions[0]

export const getEventEditionById = (id) =>
  eventEditions.find((edition) => edition.id === String(id))
