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
  <div class="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 shadow-lg">
          <span class="text-5xl">🤖</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">AI-BTI 人格测试</h1>
        <p class="text-lg text-purple-100 font-medium">27 种人格 · 20 道题 · 发现你的 AI 协作风格</p>
      </header>
      
      <!-- Welcome Screen -->
      <div v-if="currentStep === 'welcome'" class="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 transform transition-all hover:shadow-3xl">
        <div class="text-center">
          <div class="text-7xl mb-6 animate-bounce">🎭</div>
          <h2 class="text-3xl font-bold text-gray-800 mb-4 leading-tight">
            MBTI、SBTI 都过时啦！
          </h2>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            这是专为<span class="text-purple-600 font-semibold">AI 时代</span>设计的人格测试体系。<br>
            通过 20 道题目，发现你在 AI 协作中的独特风格和优势。
          </p>
          
          <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-10 border border-purple-100">
            <h3 class="font-bold text-purple-900 text-lg mb-4 flex items-center justify-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              测试说明
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-purple-800 font-medium">共 20 道题，每题 3 个选项</span>
              </div>
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-purple-800 font-medium">没有对错，选最符合你的</span>
              </div>
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-purple-800 font-medium">1 分钟即可完成</span>
              </div>
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-purple-800 font-medium">立即获得详细人格分析</span>
              </div>
            </div>
          </div>
          
          <button 
            @click="currentStep = 'quiz'"
            class="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            <span>开始测试</span>
            <svg class="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
          
          <p class="mt-6 text-sm text-gray-500">
            🔒 无需注册 · 完全免费 · 仅供娱乐
          </p>
        </div>
      </div>
      
      <!-- Quiz Screen -->
      <div v-else-if="currentStep === 'quiz'" class="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-semibold text-gray-600 uppercase tracking-wide">测试进度</span>
            <span class="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden">
            <div 
              class="bg-gradient-to-r from-purple-600 to-indigo-600 h-4 rounded-full transition-all duration-500 ease-out shadow-lg"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- Question Card -->
        <div class="mb-8">
          <div class="flex items-center mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
              <span class="text-white font-bold text-lg">Q{{ currentQuestion.id }}</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 leading-snug">{{ currentQuestion.question }}</h3>
          </div>
          
          <div class="space-y-4">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="selectAnswer(option.type)"
              class="w-full text-left p-6 rounded-2xl border-3 border-gray-200 hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 group shadow-sm hover:shadow-md transform hover:-translate-y-1"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-purple-200 group-hover:to-indigo-200 flex items-center justify-center mr-5 transition-all shadow-sm group-hover:shadow-md">
                  <span class="text-gray-700 group-hover:text-purple-800 font-bold text-lg">{{ String.fromCharCode(65 + index) }}</span>
                </div>
                <span class="text-lg text-gray-700 group-hover:text-purple-900 font-medium">{{ option.text }}</span>
              </div>
            </button>
          </div>
        </div>
        
        <!-- Navigation hint -->
        <div class="text-center text-gray-400 text-sm">
          <p>选择一个选项继续 →</p>
        </div>
      </div>
      
      <!-- Calculating Screen -->
      <div v-else-if="currentStep === 'calculating'" class="bg-white rounded-3xl shadow-2xl p-16 text-center">
        <div class="relative mb-8">
          <div class="animate-spin rounded-full h-24 w-24 border-4 border-purple-200 mx-auto"></div>
          <div class="animate-spin rounded-full h-24 w-24 border-t-4 border-purple-600 mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">正在分析你的人格...</h2>
        <p class="text-xl text-gray-600">基于你的 20 个选择，匹配最适合的人格类型</p>
        <div class="mt-8 flex justify-center space-x-2">
          <div class="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style="animation-delay: 0s"></div>
          <div class="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
      </div>
      
      <!-- Result Screen -->
      <div v-else-if="currentStep === 'result'" class="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Result Header -->
        <div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 p-10 text-white relative overflow-hidden">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div class="relative text-center">
            <div class="text-7xl mb-6">🎯</div>
            <h2 class="text-4xl font-extrabold mb-3">{{ resultData.name }}</h2>
            <div class="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <p class="text-xl italic font-medium">"{{ resultData.tagline }}"</p>
            </div>
          </div>
        </div>
        
        <!-- Result Body -->
        <div class="p-8 sm:p-10">
          <!-- Type Code -->
          <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 border-2 border-purple-200">
            <div class="text-center">
              <div class="text-sm text-purple-600 font-semibold uppercase tracking-wide mb-2">你的人格代码</div>
              <div class="text-3xl font-mono font-extrabold text-purple-900 mb-3">{{ resultType }}</div>
              <div class="flex flex-wrap justify-center gap-2 text-sm text-purple-700 font-medium">
                <span class="bg-purple-200 px-3 py-1 rounded-full">{{ resultDetail.thinking }}</span>
                <span class="text-purple-400">·</span>
                <span class="bg-indigo-200 px-3 py-1 rounded-full">{{ resultDetail.collaboration }}</span>
                <span class="text-purple-400">·</span>
                <span class="bg-fuchsia-200 px-3 py-1 rounded-full">{{ resultDetail.output }}</span>
              </div>
            </div>
          </div>
          
          <!-- Description -->
          <div class="mb-8">
            <h3 class="font-bold text-gray-800 text-xl mb-4 flex items-center">
              <span class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center mr-3 text-sm font-bold">📝</span>
              人格描述
            </h3>
            <p class="text-gray-700 leading-relaxed text-lg pl-11">{{ resultData.description }}</p>
          </div>
          
          <!-- Strengths & Weaknesses Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Strengths -->
            <div class="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
              <h3 class="font-bold text-green-800 text-lg mb-4 flex items-center">
                <span class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-3 text-sm font-bold">✨</span>
                你的优势
              </h3>
              <ul class="space-y-3">
                <li v-for="(strength, index) in resultData.strengths" :key="index" 
                    class="flex items-start text-green-800">
                  <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="font-medium">{{ strength }}</span>
                </li>
              </ul>
            </div>
            
            <!-- Weaknesses -->
            <div class="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
              <h3 class="font-bold text-yellow-800 text-lg mb-4 flex items-center">
                <span class="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center mr-3 text-sm font-bold">⚠️</span>
                潜在盲点
              </h3>
              <ul class="space-y-3">
                <li v-for="(weakness, index) in resultData.weaknesses" :key="index" 
                    class="flex items-start text-yellow-800">
                  <svg class="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <span class="font-medium">{{ weakness }}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- AI Tips -->
          <div class="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-8 mb-8 border-2 border-purple-300">
            <h3 class="font-bold text-purple-900 text-xl mb-5 flex items-center">
              <span class="text-2xl mr-3">🤖</span>
              给你的 AI 协作建议
            </h3>
            <ul class="space-y-3">
              <li v-for="(tip, index) in resultData.aiTips" :key="index" 
                  class="flex items-start text-purple-900">
                <svg class="w-6 h-6 text-purple-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
                <span class="font-medium text-lg">{{ tip }}</span>
              </li>
            </ul>
          </div>
          
          <!-- Recommended Tools -->
          <div class="bg-gradient-to-r from-indigo-100 to-fuchsia-100 rounded-2xl p-8 mb-10 border-2 border-indigo-300">
            <h3 class="font-bold text-indigo-900 text-xl mb-5 flex items-center">
              <span class="text-2xl mr-3">🛠️</span>
              推荐玩法
            </h3>
            <ul class="space-y-3">
              <li v-for="(tool, index) in resultData.recommendedTools" :key="index" 
                  class="flex items-start text-indigo-900">
                <span class="text-2xl mr-3">★</span>
                <span class="font-medium text-lg">{{ tool }}</span>
              </li>
            </ul>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              @click="restart"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg text-lg"
            >
              🔄 重新测试
            </button>
            <button 
              @click="share"
              class="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg"
            >
              📤 分享结果
            </button>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <footer class="text-center mt-12 text-purple-200 text-sm">
        <p class="font-medium">基于 AI-BTI 人格体系 · 仅供娱乐</p>
        <p class="mt-2 opacity-75">© 2026 AI-BTI Test. Made with ❤️ by 潇湘</p>
      </footer>
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

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
