"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from 'react';

import {
  Input,
  Layout,
  Notification,
  Page,
  SavebarTrigger,
} from "design-system-zeroz";
import LayoutPage from "../_components/layout";
import { useCurrentUser } from "@/hooks/user-current-user";
import { settings } from "@/actions/settings";
import { SettingsSchema } from "../../../schemas/index";

interface FormValues {
  name?: string | undefined;
  email?: string | undefined;
}

const SettingsPage = () => {
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [hasFormChanged, setHasFormChanged] = useState(false);
  const { handleSubmit, setValue, watch, reset } = useForm<
    z.infer<typeof SettingsSchema>
  >({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    settings(values)
      .then((data) => {
        if (data.error) {
          setError(data.error);
        }
        if (data.success) {
          update();
          setSuccess(data.success);
          setNotificationOpen(true);
          setTimeout(() => {
            setNotificationOpen(false);
          }, 5000);
        }
      })
      .catch(() => setError("Something went wrong!"));
  };

  const watchedValues: FormValues = watch();

  const initialValues = useMemo(
    () => ({
      name: user?.name || undefined,
      email: user?.email || undefined,
    }),
    [user]
  );

  useEffect(() => {
    const formChanged = Object.keys(initialValues).some(
      (key) =>
        watchedValues[key as keyof FormValues] !==
        initialValues[key as keyof FormValues]
    );
    setHasFormChanged(formChanged);
  }, [watchedValues, initialValues]);

  const handleInputChange = (fieldName: keyof FormValues, value: string) => {
    setValue(fieldName, value);
  };

  const handleCancel = () => {
    reset(initialValues);
  };

  return (
    <LayoutPage>
      <Page
        buttonContentPrimary="Button"
        buttonContentSecondary="Button"
        columnLayout="2 - Symmetric"
        namePage="Conta"
      >
        <SavebarTrigger
          handleSubmit={handleSubmit(onSubmit)}
          formChanged={hasFormChanged}
          handleCancel={handleCancel}
        >
          <Layout columns="2 - Symmetric">
            <Input
              label="Nome"
              value={watchedValues.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <Input
              disabled
              label="Email"
              value={watchedValues.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </Layout>
        </SavebarTrigger>
      </Page>
      {success && (
        <Notification
          icon="check_circle"
          title={success}
          variant="success"
          type="float"
          isOpen={notificationOpen}
        />
      )}
      {error && (
        <Notification
          icon="warning"
          title={error}
          variant="warning"
          type="float"
          isOpen={notificationOpen}
        />
      )}
    </LayoutPage>
  );
};

export default SettingsPage;
