// 20 道 AI-BTI 测试题

export const questions = [
  // 第一部分：思维模式 (1-7 题)
  {
    id: 1,
    question: '接到一个新项目，你第一反应是？',
    options: [
      { text: '先画架构图，理清模块关系', type: 'A' },
      { text: '先找个类似的 Demo 跑起来', type: 'E' },
      { text: '直接从最核心的功能开始写', type: 'C' }
    ]
  },
  {
    id: 2,
    question: '学习新技术时，你更喜欢？',
    options: [
      { text: '看官方文档和架构设计', type: 'A' },
      { text: '找最新教程跟着做一遍', type: 'E' },
      { text: '深入源码理解实现细节', type: 'C' }
    ]
  },
  {
    id: 3,
    question: '代码 Review 时，你最在意？',
    options: [
      { text: '整体架构是否清晰合理', type: 'A' },
      { text: '有没有用新的技术/框架', type: 'E' },
      { text: '代码风格和细节处理', type: 'C' }
    ]
  },
  {
    id: 4,
    question: '遇到技术难题，你的解决路径是？',
    options: [
      { text: '重新审视设计，看是不是架构问题', type: 'A' },
      { text: '搜索最新方案，试试别的方法', type: 'E' },
      { text: '逐行调试，找到问题根源', type: 'C' }
    ]
  },
  {
    id: 5,
    question: '你理想中的工作日是？',
    options: [
      { text: '设计系统、写技术方案', type: 'A' },
      { text: '尝试新技术、做有趣的项目', type: 'E' },
      { text: '专注写代码、打磨产品细节', type: 'C' }
    ]
  },
  {
    id: 6,
    question: '看到别人的项目，你首先关注？',
    options: [
      { text: '技术选型和架构设计', type: 'A' },
      { text: '用了什么新框架/新工具', type: 'E' },
      { text: '代码质量和实现细节', type: 'C' }
    ]
  },
  {
    id: 7,
    question: '做一个新功能，你会？',
    options: [
      { text: '先定义接口和数据结构', type: 'A' },
      { text: '先找找有没有现成的库能用', type: 'E' },
      { text: '直接开写，边写边调整', type: 'C' }
    ]
  },
  
  // 第二部分：AI 协作方式 (8-14 题)
  {
    id: 8,
    question: '你用 AI 编程时，通常是？',
    options: [
      { text: '给明确指令，让它按我的要求写', type: 'CMD' },
      { text: '和它对话讨论，一起完善方案', type: 'COL' },
      { text: '大概说下需求，让它自由发挥', type: 'DEL' }
    ]
  },
  {
    id: 9,
    question: 'AI 生成的代码你不满意，你会？',
    options: [
      { text: '指出具体问题，让它按要求重写', type: 'CMD' },
      { text: '和它讨论为什么这样写不好', type: 'COL' },
      { text: '让它"再想想别的方案"', type: 'DEL' }
    ]
  },
  {
    id: 10,
    question: '让 AI 帮你写一个功能，你会怎么描述？',
    options: [
      { text: '"写一个函数，输入 X，输出 Y，用 Z 方法"', type: 'CMD' },
      { text: '"我想实现 X 功能，你觉得怎么做比较好？"', type: 'COL' },
      { text: '"帮我做个 XX 功能，你看着来"', type: 'DEL' }
    ]
  },
  {
    id: 11,
    question: 'AI 给了你一个你没想到的方案，你会？',
    options: [
      { text: '评估后决定要不要采纳', type: 'CMD' },
      { text: '和它继续讨论这个方案的优劣', type: 'COL' },
      { text: '"挺有意思，那就这样吧"', type: 'DEL' }
    ]
  },
  {
    id: 12,
    question: '你和 AI 的关系更像？',
    options: [
      { text: '老板和员工', type: 'CMD' },
      { text: '同事/搭档', type: 'COL' },
      { text: '甲方和外包', type: 'DEL' }
    ]
  },
  {
    id: 13,
    question: '写复杂功能时，你希望 AI？',
    options: [
      { text: '按我给的步骤一步步实现', type: 'CMD' },
      { text: '和我一起讨论最佳实现方式', type: 'COL' },
      { text: '自己搞定，有问题再叫我', type: 'DEL' }
    ]
  },
  {
    id: 14,
    question: 'AI 犯了一个低级错误，你会？',
    options: [
      { text: '直接指出错误让它改', type: 'CMD' },
      { text: '问它"这里是不是有问题？"', type: 'COL' },
      { text: '让它"再看看这段代码"', type: 'DEL' }
    ]
  },
  
  // 第三部分：输出偏好 (15-20 题)
  {
    id: 15,
    question: '完成一个项目后，你最先做？',
    options: [
      { text: '整理代码，优化结构', type: 'CODE' },
      { text: '写 README 和使用文档', type: 'DOC' },
      { text: '部署上线，让人试用', type: 'PROTO' }
    ]
  },
  {
    id: 16,
    question: '你认为最重要的产出是？',
    options: [
      { text: '高质量的代码', type: 'CODE' },
      { text: '清晰的文档和注释', type: 'DOC' },
      { text: '能跑起来的 Demo', type: 'PROTO' }
    ]
  },
  {
    id: 17,
    question: '时间紧张时，你会牺牲？',
    options: [
      { text: '文档可以后面补', type: 'CODE' },
      { text: '代码可以先凑合，文档不能少', type: 'DOC' },
      { text: '功能和文档都可以简化，先出个能用的', type: 'PROTO' }
    ]
  },
  {
    id: 18,
    question: '你 GitHub 上的项目特点是？',
    options: [
      { text: '代码整洁，注释清晰', type: 'CODE' },
      { text: 'README 写得像教程', type: 'DOC' },
      { text: '很多实验性项目，有些还没写完', type: 'PROTO' }
    ]
  },
  {
    id: 19,
    question: '别人要用你的代码，你希望？',
    options: [
      { text: '他们能看懂我的代码', type: 'CODE' },
      { text: '先看我的文档再提问', type: 'DOC' },
      { text: '直接跑我的 Demo 就行', type: 'PROTO' }
    ]
  },
  {
    id: 20,
    question: '做一个新项目，你的节奏是？',
    options: [
      { text: '先把核心代码写好', type: 'CODE' },
      { text: '先写好设计文档再动手', type: 'DOC' },
      { text: '快速出个原型看看效果', type: 'PROTO' }
    ]
  }
]
