import React, { useState, useEffect } from "react";
import chayanne from './chayanne-removebg-preview.png';
import piolin from './piolinangel-removebg-preview.png';
import chayannechikito from './chayannechikito-removebg-preview.png';
import gobopiolin from './gobopiolin-removebg-preview.png';


import "./App.css";

function App() {
  const [openCard, setOpenCard] = useState(null); // Estado para controlar la carta abierta
  const [modalActive, setModalActive] = useState(false); // Estado para controlar la animación del modal

  const selectCard = (cardNumber) => {
    if (cardNumber === 3) {
      setModalActive(true); // Activa el modal si es la carta correcta
    } else {
      setOpenCard(cardNumber); // Abre la carta seleccionada
    }
  };

  const closeModal = () => {
    setModalActive(false); // Desactiva el modal
  };

  useEffect(() => {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireWorks = [];

    function random(max, min) {
      return Math.floor(Math.random() * max) + min;
    }

    class FireWorkPerticle {
      constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.speed = random(4, 1);
        this.color = color;
        this.moveX = Math.random() * 3 - 1.5;
        this.moveY = Math.random() * 3 - 1.5;
        this.size = size / 2.5;
        if (this.size < 1) {
          this.size = 1;
        }
        this.v = 0.0;
      }
      update() {
        this.x += this.moveX;
        this.y += this.moveY + this.v;
        if (this.size > 0.1) {
          this.v += 0.015;
          this.size -= 0.01;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class FireWork {
      constructor() {
        this.x = random(canvas.width, 1);
        this.y = canvas.height + 20;
        this.speed = random(4, 1);
        this.exp = random(canvas.height / 2, 0);
        this.size = random(3, 1);
        this.life = true;
        this.expParticle = [];
        this.color = "hsl(" + Math.random() * 360 + ",100%,50%)";
      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
      }
      move() {
        let dy = this.y - this.exp;
        if (dy > 10) {
          this.y -= (this.speed * dy) / 50;
        } else {
          this.y = this.exp;
          this.explode();
          this.color = "transparent";
        }
        if (!this.life) {
          this.explodeUpdate();
        }
      }
      explode() {
        if (this.life) {
          for (var i = 0; i < 100; i++) {
            this.expParticle.push(
              new FireWorkPerticle(this.x, this.y, this.size, this.color)
            );
          }
        }
        this.life = false;
      }
      explodeUpdate() {
        for (var i = 0; i < this.expParticle.length; i++) {
          this.expParticle[i].update();
          this.expParticle[i].draw();
          if (this.expParticle[i].size < 0.2) {
            this.expParticle.splice(i, 1);
          }
        }
        if (this.expParticle.length < 1) {
          this.life = "end";
        }
      }
    }

    function FireWorkInit(apendNew) {
      if (apendNew) {
        fireWorks.push(new FireWork());
      }
      for (let i = 0; i < fireWorks.length; i++) {
        fireWorks[i].draw();
        fireWorks[i].move();
        if (fireWorks[i].life === "end") {
          fireWorks.splice(i, 1);
        }
      }
    }

    let frm = 10;
    function animate() {
      ctx.fillStyle = "rgba(0,0,0,.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      frm++;
      if (frm % 20 === 0) {
        FireWorkInit(true);
      } else {
        FireWorkInit();
      }
      requestAnimationFrame(animate);
    }

    animate();

    // Ajustar tamaño del canvas al cambiar el tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [modalActive]); // Ejecutar solo cuando el modal esté activo

  return (
    <>
      <div className="title">
      ¡SELECCIONA TU MARAVILLOSO REGALO!
      </div>
    <div className="container">
        <img src={chayanne} className="chayanne" alt="logo" />
             {[1, 2, 3].map((card) => (
        <div
          key={card}
          className={`card ${openCard === card ? "open" : ""}`}
          onClick={() => selectCard(card)}
        >
          <div className="front">OPCIÓN {card}</div>
          <div className="back">
            {card === 3 ? "¡Correcto!" : "🖕🏿"}
          </div>
        </div>
      ))}

      <div id="modal-container" className={modalActive ? "active" : ""}>
        <div className="modal-background" onClick={closeModal}>
          <canvas id="canvas"></canvas>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>¡HAS GANADO UNA MARAVILLOSA CENA CON TUS QUERIDOS AMIGOS!</h2>
            <img src={piolin} className="piolin" alt="logo" />
            <img src={chayannechikito} className="chayannechikito" alt="logo" />
            <img src={gobopiolin} className="gobopiolin" alt="logo" />
            <p>ENGARDO Y MANITO</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      </div> 
      </div>

    </>
  );
}

export default App;
