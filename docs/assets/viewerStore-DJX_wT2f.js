import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

/**
 * Viewer 狀態管理 Store
 * 集中管理所有 3D 場景相關的狀態，避免 props drilling
 */
export const useViewerStore = defineStore('viewer', () => {
  // --- 載入狀態 ---
  const isLoading = ref(true)
  const isDevMode = ref(false)

  // --- 漸進式加載進度 ---
  const loadingProgress = ref({
    stage: '', // 'model' | 'outlines'
    current: 0,
    total: 0,
    percentage: 0,
    message: ''
  })

  // --- UI 控制狀態 ---
  const isSelectMode = ref(false)
  const showGameController = ref(false)

  // --- 燈光引數 ---
  const lightParams = ref({
    color: 0xffffff,
    intensity: 100,
    distance: 50,
    angle: 0.6,
    penumbra: 0.1,
    decay: 1.8,
    shadowRadius: 2,
    positionX: -5,
    positionY: 5,
    positionZ: -7.5,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
  })

  const ambientLightParams = ref({
    ambientLightColor: 0xffffff,
  })

  const directionalLightParams = ref({
    color: 0x787d87,
    intensity: 2.5,
    positionX: 7.75,
    positionY: 5.25,
    positionZ: -1.25,
    shadowBias: -0.0035,
    shadowRadius: 2,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
  })

  // --- 攝影機與場景引數 ---
  const cameraParams = ref({
    mode: 'Perspective', // 'Perspective', 'Two-Point Perspective', 'Orthographic'
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    zoom: 1,
    fov: 75,
  })

  const sceneParams = ref({
    currentSelectedObjectName: null,
    showProfileOutlines: true,
    shadowsEnabled: false,
    displayMode: 'Shaded', // 'Shaded', 'Monochrome', 'Wireframe', 'X-Ray', 'Back Edges', 'Shaded With Textures'
  })

  // --- GPU 資訊 ---
  const gpuInfo = reactive({
    tier: -1,
  })

  // --- 物件控制狀態 ---
  const controlState = reactive({})

  // --- Actions: 更新燈光引數 ---
  const updateLight = (params) => {
    lightParams.value = { ...lightParams.value, ...params }
  }

  const updateAmbientLight = (params) => {
    ambientLightParams.value = { ...ambientLightParams.value, ...params }
  }

  const updateDirectionalLight = (params) => {
    directionalLightParams.value = { ...directionalLightParams.value, ...params }
  }

  // --- Actions: 更新攝影機引數 ---
  const updateCamera = (params) => {
    cameraParams.value = { ...cameraParams.value, ...params }
  }

  // --- Actions: 更新場景引數 ---
  const updateScene = (params) => {
    sceneParams.value = { ...sceneParams.value, ...params }
  }

  // --- Actions: 更新物件控制狀態 ---
  const updateControlState = ({ key, newValues }) => {
    if (controlState[key]) {
      Object.assign(controlState[key], newValues)
    }
  }

  // --- Actions: 設定開發者模式 ---
  const setDevMode = (value) => {
    isDevMode.value = value
    sceneParams.value.shadowsEnabled = value
  }

  // --- Actions: 設定載入狀態 ---
  const setLoading = (value) => {
    isLoading.value = value
    // 與 DOM splash screen 同步
    if (!value && window.splashController) {
      window.splashController.hide()
    }
  }

  // --- Actions: 更新加載進度 ---
  const updateLoadingProgress = ({ stage, current, total, message }) => {
    loadingProgress.value = {
      stage: stage || loadingProgress.value.stage,
      current: current ?? loadingProgress.value.current,
      total: total ?? loadingProgress.value.total,
      percentage: total > 0 ? Math.round((current / total) * 100) : 0,
      message: message || loadingProgress.value.message
    }

    // 更新 DOM splash screen 的進度
    if (window.splashController) {
      window.splashController.updateProgress(
        loadingProgress.value.current,
        loadingProgress.value.total,
        loadingProgress.value.message
      )
    }
  }

  // --- Actions: 設定 GPU 資訊 ---
  const setGPUInfo = (info) => {
    Object.assign(gpuInfo, info)
  }

  // --- Actions: 設定 UI 控制狀態 ---
  const setSelectMode = (value) => {
    isSelectMode.value = value
  }

  const toggleGameController = () => {
    showGameController.value = !showGameController.value
  }

  return {
    // State
    isLoading,
    isDevMode,
    isSelectMode,
    showGameController,
    loadingProgress,
    lightParams,
    ambientLightParams,
    directionalLightParams,
    cameraParams,
    sceneParams,
    gpuInfo,
    controlState,

    // Actions
    updateLight,
    updateAmbientLight,
    updateDirectionalLight,
    updateCamera,
    updateScene,
    updateControlState,
    setDevMode,
    setLoading,
    updateLoadingProgress,
    setGPUInfo,
    setSelectMode,
    toggleGameController,
  }
})
