"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y menú desktop */}
          <div className="flex items-center space-x-8">
            {/* Logo siempre visible */}
            <div className="flex-shrink-0">
              <Link href="/">
                <img
                  className="h-10 w-auto"
                  src="/logo.png"
                  alt="Econecta"
                />
              </Link>
            </div>

            {/* Menú para desktop */}
            <div className="hidden sm:flex sm:space-x-6">
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-lg font-medium"
              >
                Inicio
              </Link>

              <Link 
                href="/about"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-lg font-medium"
              >
                Sobre Nosotros
              </Link>

              <Link 
                href="/contact"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-lg font-medium"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Botón de inicio de sesión desktop */}
          <div className="hidden sm:block">
            <a
              href="https://app.econecta.io"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 scale-[0.9]"
            >
              Iniciar Sesión
            </a>
          </div>

          {/* Botón del menú móvil */}
          <div className="sm:hidden">
            <button
              onClick={showDrawer}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
      >
        <div className="flex flex-col space-y-6 pt-4">
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-lg font-medium"
            onClick={onClose}
          >
            Inicio
          </Link>

          <Link 
            href="/about"
            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-lg font-medium"
            onClick={onClose}
          >
            Sobre Nosotros
          </Link>

          <Link 
            href="/contacto"
            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-lg font-medium"
            onClick={onClose}
          >
            Contacto
          </Link>

          <a
            href="https://app.econecta.io"
            className="inline-flex items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            onClick={onClose}
          >
            Iniciar Sesión
          </a>
        </div>
      </Drawer>
    </nav>
  );
} 