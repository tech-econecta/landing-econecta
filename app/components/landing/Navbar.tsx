"use client";

import { useState } from "react";
import Link from "next/link";
import { Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";

interface NavbarProps {
  logoWhite?: boolean;
}

export default function Navbar({ logoWhite = false }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <nav className="relative z-50 bg-transparent backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y menú desktop */}
          <div className="flex items-center space-x-8">
            {/* Logo siempre visible */}
            <div className="shrink-0">
              <Link href="/">
                <img
                  className="h-10 w-auto"
                  src={logoWhite ? "/logo-blanco.png" : "/logo.png"}
                  alt="Econecta - Tarjetas Digitales NFC Venezuela"
                />
              </Link>
            </div>

            {/* Menú para desktop */}
            <div className="hidden sm:flex sm:space-x-6">
              <Link
                href="/"
                className={`hover:text-white px-3 py-2 text-lg font-medium transition-colors ${logoWhite ? "text-white" : "text-slate-950"}`}
              >
                Inicio
              </Link>
              {/*          <Link
                href="https://econecta.shop"
                className="text-slate-950 hover:text-white px-3 py-2 text-lg font-medium transition-colors"
              >
                Vende Online
              </Link> */}

              <Link
                href="/about"
                className={`hover:text-white px-3 py-2 text-lg font-medium transition-colors ${logoWhite ? "text-white" : "text-slate-950"}`}
              >
                Sobre Nosotros
              </Link>

              <Link
                href="/contacto"
                className={`hover:text-white px-3 py-2 text-lg font-medium transition-colors ${logoWhite ? "text-white" : "text-slate-950"}`}
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Botón de inicio de sesión desktop */}
          <div className="hidden sm:block">
            <a
              href="https://app.econecta.io"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/80 transition-colors scale-[0.9]"
            >
              Iniciar Sesión
            </a>
          </div>

          {/* Botón del menú móvil */}
          <div className="sm:hidden">
            <button
              onClick={showDrawer}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
            >
              <MenuOutlined className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer para móvil */}
      <Drawer
        placement="right"
        onClose={onClose}
        open={open}
        width={280}
        className="font-medium"
        styles={{
          body: {
            backgroundColor: "#020617",
            color: "#e2e8f0",
          },
          header: {
            backgroundColor: "#020617",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <div className="flex flex-col space-y-6 pt-4">
          <Link
            href="/"
            className="text-slate-200 hover:text-white px-3 py-2 text-lg font-medium transition-colors"
            onClick={onClose}
          >
            Inicio
          </Link>

          <Link
            href="/about"
            className="text-slate-200 hover:text-white px-3 py-2 text-lg font-medium transition-colors"
            onClick={onClose}
          >
            Sobre Nosotros
          </Link>

          <Link
            href="/contacto"
            className="text-slate-200 hover:text-white px-3 py-2 text-lg font-medium transition-colors"
            onClick={onClose}
          >
            Contacto
          </Link>

          <a
            href="https://app.econecta.io"
            className="inline-flex items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/80 transition-colors"
            onClick={onClose}
          >
            Iniciar Sesión
          </a>
        </div>
      </Drawer>
    </nav>
  );
}
