"use server"
import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { EnterFormSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";

export const enter = async (values: z.infer<typeof EnterFormSchema>) => {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "Não autorizado" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Não autorizado" };
  }

  const { username, horarios, sobre, name, image } = values;

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      name,
      image,
      username,
      horarios: {
        create: {
          horaInicio: horarios?.horaInicio,
          horaFim: horarios?.horaFim,
        },
      },
      sobre,
    },
  });

  return { success: "Informações atualizadas com sucesso" };
};
