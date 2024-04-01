class Config {
  gravity = 10
  particleCount = 75
  particleSize = 1
  explosionPower = 25
  destroyTarget = true
  fade = false
  fadeBack = 4500
}

/**
 * A simple confetti animation class.
 */
export class Confetti {
  static CTX: CanvasRenderingContext2D | null = null
  static CONFIG = new Config()

  bursts: Burst[] = []
  time = Date.now()
  deltaTime = 0
  element: HTMLElement | null = null

  constructor(id: string) {
    this.setupCanvasContext()
    this.setupElement(id)
    window.requestAnimationFrame(this.update.bind(this))
  }

  setCount(count: number): void {
    if (typeof count !== 'number') {
      throw new Error("Input must be of type 'number'")
    }
    Confetti.CONFIG.particleCount = count
  }

  setPower(power: number): void {
    if (typeof power !== 'number') {
      throw new Error("Input must be of type 'number'")
    }
    Confetti.CONFIG.explosionPower = power
  }

  setSize(size: number): void {
    if (typeof size !== 'number') {
      throw new Error("Input must be of type 'number'")
    }
    Confetti.CONFIG.particleSize = size
  }

  setFade(fade: boolean): void {
    if (typeof fade !== 'boolean') {
      throw new Error("Input must be of type 'boolean'")
    }
    Confetti.CONFIG.fade = fade
  }

  destroyTarget(destroy: boolean): void {
    if (typeof destroy !== 'boolean') {
      throw new Error("Input must be of type 'boolean'")
    }
    Confetti.CONFIG.destroyTarget = destroy
  }

  setFadeBack(fadeBack: number): void {
    if (typeof fadeBack !== 'number') {
      throw new Error("Input must be of type 'number'")
    }
    Confetti.CONFIG.fadeBack = fadeBack
  }

  setupCanvasContext(): void {
    if (!Confetti.CTX) {
      const canvas = document.createElement('canvas')
      Confetti.CTX = canvas.getContext('2d')
      canvas.width = 2 * window.innerWidth
      canvas.height = 2 * window.innerHeight
      canvas.style.position = 'fixed'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.width = 'calc(100%)'
      canvas.style.height = 'calc(100%)'
      canvas.style.margin = '0'
      canvas.style.padding = '0'
      canvas.style.zIndex = '999999999'
      canvas.style.pointerEvents = 'none'
      document.body.appendChild(canvas)
      window.addEventListener('resize', () => {
        canvas.width = 2 * window.innerWidth
        canvas.height = 2 * window.innerHeight
      })
    }
  }

  setupElement(id: string): void {
    this.element = document.getElementById(id)
    if (this.element) {
      this.element.addEventListener('click', (event) => {
        const position = new Vector(2 * event.clientX, 2 * event.clientY)
        this.bursts.push(new Burst(position))
        if (Confetti.CONFIG.destroyTarget && this.element) {
          this.element.style.visibility = 'hidden'
          this.element.style.transition = 'opacity 1000ms'
          this.element.style.opacity = '0'
          setTimeout(() => {
            if (this.element) {
              this.element.style.visibility = 'visible'
              this.element.style.opacity = '1'
            }
          }, Confetti.CONFIG.fadeBack)
        }
      })
    }
  }

  update(t: number): void {
    this.deltaTime = (t - this.time) / 1000
    this.time = t
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      this.bursts[i].update(this.deltaTime)
      if (this.bursts[i].particles.length === 0) {
        this.bursts.splice(i, 1)
      }
    }
    this.draw()
    window.requestAnimationFrame(this.update.bind(this))
  }

  draw(): void {
    Renderer.clearScreen()
    for (const burst of this.bursts) {
      burst.draw()
    }
  }
}

class Vector {
  constructor(public x = 0, public y = 0) {}

  static generateVelocity(): Vector {
    const t = Math.random() - 0.5
    const i = Math.random() - 0.7
    const n = Math.sqrt(t * t + i * i)
    const iOverN = i / n
    const tOverN = t / n
    return new Vector(
      tOverN * (Math.random() * Confetti.CONFIG.explosionPower),
      iOverN * (Math.random() * Confetti.CONFIG.explosionPower)
    )
  }
}

class Renderer {
  static clearScreen(): void {
    if (Confetti.CTX) {
      Confetti.CTX.clearRect(
        0,
        0,
        2 * window.innerWidth,
        2 * window.innerHeight
      )
    }
  }

  static drawRectangle(
    position: Vector,
    size: Vector,
    rotation: number,
    hue: number,
    opacity: number
  ): void {
    if (Confetti.CTX) {
      Confetti.CTX.save()
      Confetti.CTX.beginPath()
      Confetti.CTX.translate(position.x + size.x / 2, position.y + size.y / 2)
      Confetti.CTX.rotate((rotation * Math.PI) / 180)
      Confetti.CTX.rect(-size.x / 2, -size.y / 2, size.x, size.y)
      Confetti.CTX.fillStyle = `hsla(${hue}deg, 90%, 65%, ${opacity}%)`
      Confetti.CTX.fill()
      Confetti.CTX.restore()
    }
  }
}

class Particle {
  size: Vector
  position: Vector
  velocity: Vector
  rotation: number
  rotationSpeed: number
  hue: number
  opacity: number
  lifetime: number

  constructor(position: Vector) {
    this.size = new Vector(
      (16 * Math.random() + 4) * Confetti.CONFIG.particleSize,
      (4 * Math.random() + 4) * Confetti.CONFIG.particleSize
    )
    this.position = new Vector(
      position.x - this.size.x / 2,
      position.y - this.size.y / 2
    )
    this.velocity = Vector.generateVelocity()
    this.rotation = 360 * Math.random()
    this.rotationSpeed = 10 * (Math.random() - 0.5)
    this.hue = 360 * Math.random()
    this.opacity = 100
    this.lifetime = Math.random() + 0.25
  }

  update(t: number): void {
    this.velocity.y +=
      Confetti.CONFIG.gravity *
      (this.size.y / (10 * Confetti.CONFIG.particleSize)) *
      t
    this.velocity.x += 25 * (Math.random() - 0.5) * t
    this.velocity.y *= 0.98
    this.velocity.x *= 0.98
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.rotation += this.rotationSpeed
    if (Confetti.CONFIG.fade) this.opacity -= this.lifetime
  }

  checkBounds(): boolean {
    return this.position.y - 2 * this.size.x > 2 * window.innerHeight
  }

  draw(): void {
    Renderer.drawRectangle(
      this.position,
      this.size,
      this.rotation,
      this.hue,
      this.opacity
    )
  }
}

class Burst {
  particles: Particle[]

  constructor(position: Vector) {
    this.particles = Array.from(
      { length: Confetti.CONFIG.particleCount },
      () => new Particle(position)
    )
  }

  update(t: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(t)
      if (this.particles[i].checkBounds()) {
        this.particles.splice(i, 1)
      }
    }
  }

  draw(): void {
    for (const particle of this.particles) {
      particle.draw()
    }
  }
}
