"use client"
import React, { useState, useEffect, startTransition } from "react";
import {
  ButtonGroup,
  Modal,
  FooterModal,
  ContentModal,
  Input,
  InputSelect,
  InputCheckbox,
  Icon,
  ImageUploader,
  InputTextArea,
} from "design-system-zeroz";
import { useCurrentUser } from "@/hooks/user-current-user";
import "./enter-form.scss";

import { EnterFormSchema } from "@/schemas/index";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { enter } from "@/actions/enter";

type ModalsState = {
  [key: string]: boolean;
};

type SwitchState = {
  [key: string]: boolean;
};

export function EnterForm() {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof EnterFormSchema>>({
    resolver: zodResolver(EnterFormSchema),
    defaultValues: {
      username: user?.name?.toLowerCase().replace(/\s/g, ""),
      name: user?.name || "",
      horarios: { horaInicio: "", horaFim: "" },
      diasDisponiveis: {
        Domingo: false,
        Segunda: false,
        Terça: false,
        Quarta: false,
        Quinta: false,
        Sexta: false,
        Sábado: false,
      },
      image: "",
      sobre: "",
    },
  });

  const onSubmit = (values: z.infer<typeof EnterFormSchema>) => {
    setSuccess("");
    setError("");

    startTransition(() => {
      enter(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  const [modals, setModals] = useState<ModalsState>({
    modal1: true,
    modal2: false,
    modal3: false,
    modal4: false,
  });

  const [switches, setSwitches] = useState<SwitchState>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const toggleModal = (modal: string) => {
    const updatedModals = { ...modals };
    for (const modalKey in updatedModals) {
      if (modalKey === modal) {
        updatedModals[modalKey] = !modals[modalKey];
      } else {
        updatedModals[modalKey] = false;
      }
    }
    setModals(updatedModals);
  };

  const horariosDoDia = () => {
    let horas = [];
    for (let hora = 0; hora < 24; hora++) {
      horas.push(`${hora}:00`);
    }
    return horas;
  };

  const diasDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Modal 1 */}
        <Modal
          dismissible={true}
          hideModal={() => toggleModal("modal1")}
          isOpen={modals.modal1}
          description="Nós precisamos somente de mais algumas informações."
          title="Bem-vindo ao Agendar App"
          content={
            <ContentModal>
              <div className="steps">
                <div className="step-completed" />
                <div className="step-to-complete" />
                <div className="step-to-complete" />
              </div>
              <small>Passo 1 de 3</small>
              <Input
                label="Username"
                disabled
                value={`site.com/${user?.name?.toLowerCase().replace(/\s/g, "")}`}
              />
              <Input label="Nome" value={user?.name || undefined} />
            </ContentModal>
          }
          footer={
            <FooterModal>
              <div className="enter-form-footer">
                <div>
                  <ButtonGroup
                    contentSecondButton="Próximo"
                    variantSecondButton="primary"
                    direction="row"
                    variantFirstButton="secondary"
                    onClickSecondButton={() => toggleModal("modal2")}
                    onClickFirstButton={() => toggleModal("modal1")}
                    contentFirstButton="Pular"
                  />
                </div>
              </div>
            </FooterModal>
          }
        />

        {/* Modal 2 */}
        <Modal
          dismissible={true}
          hideModal={() => toggleModal("modal2")}
          isOpen={modals.modal2}
          description="Aqui você pode definir seus horários de trabalho."
          title="Defina seus Horários"
          content={
            <ContentModal>
              <div className="steps">
                <div className="step-completed" />
                <div className="step-completed" />
                <div className="step-to-complete" />
              </div>
              <small>Passo 2 de 3</small>
              <div className="available-hours">
                <p>Horários disponíveis</p>
                <div className="hour-input-select">
                  <InputSelect
                    onChange={() => {}}
                    label=""
                    value=""
                    options={horariosDoDia()}
                  />
                  <InputSelect
                    onChange={() => {}}
                    label=""
                    value=""
                    options={horariosDoDia()}
                  />
                </div>
              </div>
              <div className="available-days">
                <p>Dias disponíveis</p>
                <div className="day-input-checkbox">
                  {diasDaSemana.map((dia, index) => (
                    <div key={index} className="checking">
                      <InputCheckbox
                        label={dia}
                        checked={switches[dia]}
                        onChange={(isChecked) =>
                          setSwitches((prevSwitches) => ({
                            ...prevSwitches,
                            [dia]: isChecked,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  color: "var(--b-color-base)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--s-spacing-xx-small)",
                  justifyContent: "center",
                }}
              >
                <Icon size="md" icon="campaign" />
                <small>
                  Não se preocupe! Você poderá alterar seus horários depois.
                </small>
              </div>
            </ContentModal>
          }
          footer={
            <FooterModal>
              <div className="enter-form-footer">
                <div>
                  <ButtonGroup
                    contentSecondButton="Próximo"
                    variantSecondButton="primary"
                    direction="row"
                    variantFirstButton="secondary"
                    onClickSecondButton={() => toggleModal("modal3")}
                    onClickFirstButton={() => toggleModal("modal1")}
                    contentFirstButton="Voltar"
                  />
                </div>
              </div>
            </FooterModal>
          }
        />

        {/* Modal 3 */}
        <Modal
          dismissible={true}
          hideModal={() => toggleModal("modal3")}
          isOpen={modals.modal3}
          description="Vamos conhecer um pouco de você."
          title="Quase lá!"
          content={
            <ContentModal>
              <div className="steps">
                <div className="step-completed" />
                <div className="step-completed" />
                <div className="step-completed" />
              </div>
              <small>Passo 3 de 3</small>
              <div className="modal3">
                <div className="add-photo">
                  
                </div>
                <div>
                  <InputTextArea
                    placeholder=""
                    label="Sobre você"
                    value={form.getValues("sobre")}
                  />
                  <small>
                    Um pequeno texto sobre você. Isso irá aparecer na sua página.
                  </small>
                </div>
              </div>
            </ContentModal>
          }
          footer={
            <FooterModal>
              <div className="enter-form-footer">
                <div>
                  <ButtonGroup
                    contentSecondButton="Salvar"
                    variantSecondButton="primary"
                    direction="row"
                    variantFirstButton="secondary"
                    onClickSecondButton={() => toggleModal("modal4")}
                    onClickFirstButton={() => toggleModal("modal2")}
                    contentFirstButton="Voltar"
                  />
                </div>
              </div>
            </FooterModal>
          }
        />
      </form>
    </>
  );
}
