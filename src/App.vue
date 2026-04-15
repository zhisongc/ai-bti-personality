<script setup>
import { ref, computed } from 'vue'
import { questions } from './data/questions.js'
import { personalities, typeMapping } from './data/personality.js'

// 状态管理
const currentStep = ref('welcome') // welcome, quiz, calculating, result
const answers = ref({})
const scores = ref({
  thinking: { A: 0, E: 0, C: 0 },
  collaboration: { CMD: 0, COL: 0, DEL: 0 },
  output: { CODE: 0, DOC: 0, PROTO: 0 }
})

// 计算当前题目索引
const currentQuestionIndex = computed(() => {
  return Object.keys(answers.value).length
})

const currentQuestion = computed(() => {
  return questions[currentQuestionIndex.value]
})

const progress = computed(() => {
  return ((Object.keys(answers.value).length / questions.length) * 100).toFixed(0)
})

// 选择答案
function selectAnswer(optionType) {
  answers.value[currentQuestion.value.id] = optionType
  
  // 更新分数
  updateScores(optionType)
  
  // 判断是否完成
  if (Object.keys(answers.value).length >= questions.length) {
    calculateResult()
  }
}

// 更新分数
function updateScores(optionType) {
  // 思维模式 (1-7 题)
  if (['A', 'E', 'C'].includes(optionType)) {
    scores.value.thinking[optionType]++
  }
  // AI 协作方式 (8-14 题)
  else if (['CMD', 'COL', 'DEL'].includes(optionType)) {
    scores.value.collaboration[optionType]++
  }
  // 输出偏好 (15-20 题)
  else if (['CODE', 'DOC', 'PROTO'].includes(optionType)) {
    scores.value.output[optionType]++
  }
}

// 计算结果
function calculateResult() {
  currentStep.value = 'calculating'
  
  setTimeout(() => {
    // 找出每个维度得分最高的选项
    const thinking = Object.entries(scores.value.thinking)
      .sort(([,a], [,b]) => b - a)[0][0]
    
    const collaboration = Object.entries(scores.value.collaboration)
      .sort(([,a], [,b]) => b - a)[0][0]
    
    const output = Object.entries(scores.value.output)
      .sort(([,a], [,b]) => b - a)[0][0]
    
    // 组合成人格类型
    resultType.value = `${thinking}-${collaboration}-${output}`
    resultData.value = personalities[resultType.value]
    resultDetail.value = {
      thinking: typeMapping.thinking[thinking],
      collaboration: typeMapping.collaboration[collaboration],
      output: typeMapping.output[output],
      scores: { ...scores.value }
    }
    
    currentStep.value = 'result'
  }, 1500)
}

// 结果数据
const resultType = ref('')
const resultData = ref(null)
const resultDetail = ref(null)

// 重新开始
function restart() {
  answers.value = {}
  scores.value = {
    thinking: { A: 0, E: 0, C: 0 },
    collaboration: { CMD: 0, COL: 0, DEL: 0 },
    output: { CODE: 0, DOC: 0, PROTO: 0 }
  }
  currentStep.value = 'welcome'
  resultType.value = ''
  resultData.value = null
  resultDetail.value = null
}

// 分享
function share() {
  const text = `我的 AI-BTI 人格是【${resultData.value.name}】\n🏗️ ${resultData.value.tagline}\n来看看你是什么人格！`
  
  if (navigator.share) {
    navigator.share({
      title: 'AI-BTI 人格测试',
      text: text,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(text + '\n' + window.location.href)
    alert('已复制到剪贴板！')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">🤖 AI-BTI 人格测试</h1>
        <p class="text-white/80">27 种人格 · 20 道题 · 1 分钟</p>
      </div>
      
      <!-- Welcome Screen -->
      <div v-if="currentStep === 'welcome'" class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center">
          <div class="text-6xl mb-6">🎭</div>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            MBTI、SBTI 都过时啦！
          </h2>
          <p class="text-gray-600 mb-6 leading-relaxed">
            这是专为 AI 时代设计的人格测试体系。<br>
            通过 20 道题目，发现你在 AI 协作中的独特风格。
          </p>
          
          <div class="bg-indigo-50 rounded-xl p-6 mb-8">
            <h3 class="font-semibold text-indigo-900 mb-3">测试说明：</h3>
            <ul class="text-left text-indigo-800 space-y-2">
              <li>✅ 共 20 道题，每题 3 个选项</li>
              <li>✅ 没有对错，选最符合你的</li>
              <li>✅ 1 分钟即可完成</li>
              <li>✅ 立即获得详细人格分析</li>
            </ul>
          </div>
          
          <button 
            @click="currentStep = 'quiz'"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            开始测试 →
          </button>
        </div>
      </div>
      
      <!-- Quiz Screen -->
      <div v-else-if="currentStep === 'quiz'" class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>进度</span>
            <span>{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- Question -->
        <div class="mb-8">
          <h3 class="text-xl font-bold text-gray-800 mb-6">
            Q{{ currentQuestion.id }}. {{ currentQuestion.question }}
          </h3>
          
          <div class="space-y-3">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="selectAnswer(option.type)"
              class="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-indigo-200 flex items-center justify-center mr-4 transition-colors">
                  <span class="text-gray-600 group-hover:text-indigo-700 font-semibold">{{ String.fromCharCode(65 + index) }}</span>
                </div>
                <span class="text-gray-700 group-hover:text-indigo-900">{{ option.text }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Calculating Screen -->
      <div v-else-if="currentStep === 'calculating'" class="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">正在分析你的人格...</h2>
        <p class="text-gray-600">基于你的 20 个选择，匹配最适合的人格类型</p>
      </div>
      
      <!-- Result Screen -->
      <div v-else-if="currentStep === 'result'" class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Result Header -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div class="text-center">
            <div class="text-5xl mb-4">🎯</div>
            <h2 class="text-3xl font-bold mb-2">{{ resultData.name }}</h2>
            <p class="text-white/90 text-lg italic">"{{ resultData.tagline }}"</p>
          </div>
        </div>
        
        <!-- Result Body -->
        <div class="p-8">
          <!-- Type Code -->
          <div class="bg-indigo-50 rounded-xl p-4 mb-6">
            <div class="text-center">
              <div class="text-sm text-indigo-600 mb-2">你的人格代码</div>
              <div class="text-2xl font-mono font-bold text-indigo-900">{{ resultType }}</div>
              <div class="text-sm text-indigo-700 mt-2">
                {{ resultDetail.thinking }} · {{ resultDetail.collaboration }} · {{ resultDetail.output }}
              </div>
            </div>
          </div>
          
          <!-- Description -->
          <div class="mb-6">
            <h3 class="font-bold text-gray-800 mb-3 flex items-center">
              <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 text-sm">📝</span>
              人格描述
            </h3>
            <p class="text-gray-700 leading-relaxed">{{ resultData.description }}</p>
          </div>
          
          <!-- Strengths -->
          <div class="mb-6">
            <h3 class="font-bold text-gray-800 mb-3 flex items-center">
              <span class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-sm">✨</span>
              你的优势
            </h3>
            <ul class="space-y-2">
              <li v-for="(strength, index) in resultData.strengths" :key="index" 
                  class="flex items-start text-gray-700">
                <span class="text-green-500 mr-2 mt-1">✓</span>
                {{ strength }}
              </li>
            </ul>
          </div>
          
          <!-- Weaknesses -->
          <div class="mb-6">
            <h3 class="font-bold text-gray-800 mb-3 flex items-center">
              <span class="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-2 text-sm">⚠️</span>
              潜在盲点
            </h3>
            <ul class="space-y-2">
              <li v-for="(weakness, index) in resultData.weaknesses" :key="index" 
                  class="flex items-start text-gray-700">
                <span class="text-yellow-500 mr-2 mt-1">!</span>
                {{ weakness }}
              </li>
            </ul>
          </div>
          
          <!-- AI Tips -->
          <div class="bg-indigo-50 rounded-xl p-6 mb-6">
            <h3 class="font-bold text-indigo-900 mb-4 flex items-center">
              <span class="mr-2">🤖</span>
              给你的 AI 协作建议
            </h3>
            <ul class="space-y-2">
              <li v-for="(tip, index) in resultData.aiTips" :key="index" 
                  class="flex items-start text-indigo-800">
                <span class="text-indigo-500 mr-2 mt-1">→</span>
                {{ tip }}
              </li>
            </ul>
          </div>
          
          <!-- Recommended Tools -->
          <div class="bg-purple-50 rounded-xl p-6 mb-8">
            <h3 class="font-bold text-purple-900 mb-4 flex items-center">
              <span class="mr-2">🛠️</span>
              推荐玩法
            </h3>
            <ul class="space-y-2">
              <li v-for="(tool, index) in resultData.recommendedTools" :key="index" 
                  class="flex items-start text-purple-800">
                <span class="text-purple-500 mr-2 mt-1">★</span>
                {{ tool }}
              </li>
            </ul>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-4">
            <button 
              @click="restart"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors"
            >
              🔄 重新测试
            </button>
            <button 
              @click="share"
              class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              📤 分享结果
            </button>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="text-center mt-8 text-white/70 text-sm">
        <p>基于 AI-BTI 人格体系 · 仅供娱乐</p>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.bg-white {
  animation: fadeIn 0.5s ease-out;
}
</style>
