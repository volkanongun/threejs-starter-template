import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

renderer.shadowMap.enabled = true

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth/window.innerHeight,
  1,
  1000
)
camera.position.set(-10,30,30)

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const planeGeometry = new THREE.PlaneGeometry(30,30)
const planeMaterial = new THREE.MeshStandardMaterial({ color : 0xFFFFFF, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -.5 * Math.PI
plane.receiveShadow = true

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50)
const sphereMaterial = new THREE.MeshStandardMaterial({ color : 0x0000FF })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(-10, 10, 0)
sphere.castShadow = true

const gridHelper = new THREE.GridHelper(30)
scene.add(gridHelper)

const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

const spotlight = new THREE.SpotLight(0xFFFFFF)
scene.add(spotlight)
spotlight.position.set(-100,100,0)
spotlight.castShadow = true
spotlight.angle = .2

const options = {
  sphereColor : '#ffea00',
  wireframe: false,
  speed: 0.01,
  angle: .2,
  penumbra: 0,
  intensity: 1
}

const gui = new dat.GUI()

gui.addColor(options, 'sphereColor').onChange((e)=>{
  sphere.material.color.set(e)
})

gui.add(options, 'wireframe').onChange((e)=>{
  sphere.material.wireframe = e
})

gui.add(options, 'speed', 0, 0.1)

gui.add(options, 'angle', 0, 1)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 1)

let step = 0

const sphereId = sphere.id
const rayCaster = new THREE.Raycaster()

function animate(time){

  step += options.speed
  sphere.position.y = 10 * Math.abs(Math.sin(step))

  spotlight.angle = options.angle
  spotlight.penumbra = options.penumbra
  spotlight.intensity = options.intensity

  rayCaster.setFromCamera(mousePosition, camera)
  const intersects = rayCaster.intersectObjects(scene.children)
  
  for (let i = 0; i < intersects.length; i++) {

    if(intersects[i].object.id === sphereId){
      intersects[i].object.material.color.set(0xFF0000)
    }
    
  }

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const mousePosition = new THREE.Vector2()
window.addEventListener('mousemove', function(e){
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1
})