import { useEffect, useState } from "react";

const RandomText = () => {
  const texts = [
    "No es un error, es una característica",
    "Todas tus cookies me pertenecen",
    "No sabía como hacerlo, pero lo hice",
    "¿Probaste apagar y volver a encender?",
    "Error 404: Chiste no encontrado",
    "El chiste está en otro castillo",
  ];

  const [text, setText] = useState("");

  useEffect(() => {
    const aleatorio = texts[Math.floor(Math.random() * texts.length)];
    setText(aleatorio);
  }, []);

  return <span>{text}</span>;
};

export default RandomText;
