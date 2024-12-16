import React from "react";

// Define el tipo para cada botón
type Button = {
  label: string;
  url: string;
  color: string;
  label_color: string;
  path_icon?: string; // Opcional
  border_radius?: number; // Opcional
  width?: number; // Opcional
  height?: number; // Opcional
};

// Define las props del componente
type ButtonsProps = {
  buttonsData: Button[]; // Lista de botones
};

const Buttons: React.FC<ButtonsProps> = ({ buttonsData }) => {
  return (
    <div
      className="buttons"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)", // Siempre dos columnas
        gridGap: "35px", // Espaciado entre los botones
        paddingTop: "10px",
        width: "100%", // Abarca el 100% del ancho de la pantalla
      }}
    >
      {buttonsData.map((button, index) => (
        <a
          key={index}
          href={button.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            overflow: "clip",
          }}
        >
          <div
            className="button"
            style={{
              backgroundColor: button.color || "transparent",
              borderRadius: `${button.border_radius ?? 10}px`,
              display: "flex", // Usamos flexbox
              flexDirection: "column", // Coloca la imagen y el texto en columna
              justifyContent: "center", // Centra verticalmente
              alignItems: "center", // Centra horizontalmente
              cursor: "pointer",
              padding: "10px",
              margin: "auto",
              fontFamily: "Poppins",
            }}
          >
            {button.path_icon && (
              <img
                src={button.path_icon}
                alt={button.label}
                style={{
                  maxWidth: "80%", // Escala el ícono al 70% del ancho del botón
                  maxHeight: "80%", // Escala el ícono al 70% del alto del botón
                  borderRadius: `${button.border_radius ?? 10}px`,
                }}
                className="w-[100px]"
              />
            )}
            <p
              style={{
                color: button.label_color,
                fontSize: "16px",
                fontWeight: "500",
                marginTop: "12px", // Espaciado entre la imagen y el texto
                textAlign: "center",
                wordBreak: "break-word",
                whiteSpace: "nowrap",
                fontFamily: "Poppins",
              }}
            >
              {button.label}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default Buttons;
