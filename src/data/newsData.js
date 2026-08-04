// src/data/newsData.js
// 注意：数组按最新在前排序，新条目必须加在最前面（首页「最新动态」取前 3 条）

import tuijieDay from '@/assets/news/2025社团推介日.webp'
import zhaoxinMeeting from '@/assets/news/2025招新见面会.webp'
import zhongzibei2025 from '@/assets/event/第四届萌新种子杯.jpg'

const dalianCompetition = `${import.meta.env.BASE_URL}hero.webp`

export const newsData = [
  {
    title: '第六届萌新种子杯筹备动态',
    date: '2026年8月',
    excerpt: '第六届“萌新种子杯”正在筹备中。报名时间、赛道设置、培训安排与命题文档将根据筹备进度陆续公布，请关注本站后续通知。',
    image: dalianCompetition
  },
  {
    title: '第五届萌新种子杯赛事公告',
    date: '2025年11月17日',
    excerpt: '“萌新种子杯”由工程实践创新中心主办，设置视觉循迹仿真、开关电源设计和三维建模设计三个赛道，其中开关电源设计赛道由学 D317 工作室协办，欢迎全校同学报名参与。',
    image: zhongzibei2025
  },
  {
    title: '参加校园社团招新活动',
    date: '2025年10月21日',
    excerpt: '金秋十月，我们携智能物流搬运机器人、测绘车参加校园社团招新，现场开展设备演示与技术交流，向同学们介绍工作室的项目方向与实践方式。',
    image: tuijieDay
  },
  {
    title: '机器人社团招新见面会',
    date: '2025年9月23日',
    excerpt: '招新见面会介绍了工作室的发展历程、技术方向与项目实践方式，负责人和核心成员与到场同学进行了交流。',
    image: zhaoxinMeeting
  },
  {
    title: '赴大连参加工程实践与创新能力大赛全国总决赛',
    date: '2025年8月',
    excerpt: '经过数月备赛，智能救援与智能物流搬运两支队伍代表学校赴大连参加工程实践与创新能力大赛全国总决赛，与来自全国的参赛队伍开展交流与竞赛。',
    image: dalianCompetition
  },
]
