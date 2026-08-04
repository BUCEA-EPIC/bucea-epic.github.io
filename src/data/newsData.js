// src/data/newsData.js
// 注意：数组按最新在前排序，新条目必须加在最前面（首页「最新动态」取前 3 条）

import tuijieDay from '@/assets/news/2025社团推介日.webp'
import zhaoxinMeeting from '@/assets/news/2025招新见面会.webp'
import zhongzibei2025 from '@/assets/event/第四届萌新种子杯.jpg'

const dalianCompetition = `${import.meta.env.BASE_URL}hero.webp`

export const newsData = [
  {
    title: '第五届萌新种子杯赛事公告',
    date: '2025年11月17日',
    excerpt: '“萌新种子杯”由工程实践创新中心主办，设置视觉循迹仿真、开关电源设计（学 D317 协办）和三维建模设计三个赛道，欢迎全校同学报名参与。',
    image: zhongzibei2025
  },
  {
    title: '参加机器人社团招新（百团大战）',
    date: '2025年10月21日',
    excerpt: '金秋十月，我们携智能物流搬运机器人、测绘车参加校园社团招新，现场开展设备演示与技术交流，向同学们介绍工作室的项目方向与实践方式。',
    image: tuijieDay
  },
  {
    title: '机器人社招新见面会',
    date: '2025年9月23日',
    excerpt: '一场关于梦想与创造的集结！招新见面会座无虚席，工作室负责人与核心成员分享了团队的成长故事、技术方向与未来规划。现场气氛热烈，我们感受到了新一代同学对机器人技术的无限热情。',
    image: zhaoxinMeeting
  },
  {
    title: '前往大连参加工创大赛国赛',
    date: '2025年8月',
    excerpt: '出征！在经历了数月的精心备赛后，我们的智能救援与智能物流搬运两支队伍，代表学校前往美丽的海滨城市大连，参加工程实践与创新能力大赛全国总决赛，与来自全国的顶尖队伍一较高下。',
    image: dalianCompetition
  },
]
