import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Rotas públicas
  layout("routes/_public.tsx", [route("/login", "routes/login.tsx")]),

  // Rotas protegidas
  layout("routes/_auth.tsx", [
    index("routes/home.tsx"),
    route("/account", "routes/account.tsx"),
    route("/users", "routes/users.tsx"),
    route("/volunteers", "routes/volunteers.tsx"),
    route("/atividades", "routes/atividades.tsx"),
    route("/families", "routes/familias.tsx"),
    route("/cestas", "routes/cestas.tsx"),
    route("/doacoes", "routes/doacoes.tsx"),
  ]),
] satisfies RouteConfig;
