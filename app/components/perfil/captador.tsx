"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Switch,
  Radio,
  Button,
  message,
} from "antd";

type CaptadorCampo = {
  nombre: string;
  label: string;
  placeholder?: string;
  type: "input" | "email" | "number" | "textarea" | "date" | "DatePicker" | "InputNumber" | "Switch" | "Radio";
};

type CaptadorProps = {
  visible: boolean;
  campos: CaptadorCampo[];
  backgroundColor?: string;
  submitColor?: string;
  submitTextColor?: string;
  title?: string;
  titleColor?: string;
  username: string; // Nuevo: el nombre de usuario para la API
  isMandatory?: boolean;
};

const Captador: React.FC<CaptadorProps> = ({
  visible,
  campos,
  backgroundColor: _backgroundColor = "#fff",
  submitColor = "#000",
  submitTextColor = "#fff",
  title = "Formulario",
  titleColor = "#000",
  username,
  isMandatory = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setIsModalVisible(true);
      }, 0);

      return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }
  }, [visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(`/api/captador/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Registro guardado exitosamente");
        form.resetFields();
        setIsModalVisible(false);
      } else {
        const { error } = await response.json();
        message.error(`Error al guardar: ${error}`);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      message.error("Error al enviar el formulario");
    }
  };

  return (
    <Modal
      title={<span style={{ color: titleColor }}>{title}</span>}
      open={isModalVisible}
      centered
      onCancel={() => !isMandatory && setIsModalVisible(false)}
      closable={!isMandatory}
      maskClosable={!isMandatory}
      keyboard={!isMandatory}
      footer={[
        <Button
          key="submit"
          style={{ backgroundColor: submitColor, color: submitTextColor }}
          onClick={handleSubmit}
        >
          Enviar
        </Button>,
      ]}
      //bodyStyle={{ backgroundColor }}
    >
      <Form form={form} layout="vertical">
        {campos.map((campo) => {
          switch (campo.type) {
            case "input":
              return (
                <Form.Item
                  key={campo.nombre}
                  name={campo.nombre}
                  label={campo.label}
                  rules={[{ required: true }]}
                >
                  <Input placeholder={campo.placeholder} />
                </Form.Item>
              );
            case "email":
              return (
                <Form.Item
                  key={campo.nombre}
                  name={campo.nombre}
                  label={campo.label}
                  rules={[{ required: true, type: "email", message: "Correo inválido" }]}
                >
                  <Input type="email" placeholder={campo.placeholder} />
                </Form.Item>
              );
            case "textarea":
              return (
                <Form.Item
                  key={campo.nombre}
                  name={campo.nombre}
                  label={campo.label}
                  rules={[{ required: true }]}
                >
                  <Input.TextArea placeholder={campo.placeholder} rows={3} />
                </Form.Item>
              );
            case "date":
            case "DatePicker":
              return (
                <Form.Item
                  key={campo.nombre}
                  name={campo.nombre}
                  label={campo.label}
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: "100%" }} placeholder={campo.placeholder} />
                </Form.Item>
              );
            case "number":
            case "InputNumber":
              return (
                <Form.Item
                  key={campo.nombre}
                  name={campo.nombre}
                  label={campo.label}
                  rules={[{ required: true }]}
                >
                  <InputNumber style={{ width: "100%" }} placeholder={campo.placeholder} />
                </Form.Item>
              );
            case "Switch":
              return (
                <Form.Item
                  key={campo.nombre}
                  name={campo.nombre}
                  label={campo.label}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              );
            case "Radio":
              return (
                <Form.Item
                  key={campo.nombre}
                  name={campo.nombre}
                  label={campo.label}
                  rules={[{ required: true }]}
                >
                  <Radio.Group>
                    <Radio value={true}>Sí</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              );
            default:
              return null;
          }
        })}
      </Form>
    </Modal>
  );
};

export default Captador;
