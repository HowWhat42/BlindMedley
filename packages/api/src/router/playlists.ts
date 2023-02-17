import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const playlistRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.playlist.findMany({ orderBy: { id: "desc" } });
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.playlist.findFirst({
      where: { id: input },
      include: { tracks: true },
    });
  }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.playlist.delete({ where: { id: input } });
  }),
});
