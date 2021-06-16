export const VanillaEsm = `import { createDico } from "@dico/client";
// Dico data file is created next to your \`dico.config.json\` file
import data from "../dico.data.json";

export const { $dico, $dicoI18n } = createDico(data);
`;

export const VanillaEsmRoot = `import { createDico } from "@dico/client";
// Dico data file is created next to your \`dico.config.json\` file
import data from "../dico.data.json";

export const { $dico, $dicoI18n } = createDico(data);
`;

export const VanillaCjs = `const { createDico } = require("@dico/client");
// Dico data file is created next to your \`dico.config.json\` file
const data = require("./dico.data.json");

const { $dico, $dicoI18n } = createDico(data);

exports.$dico = $dico;
exports.$dicoI18n = $dicoI18n;
`;

export const VanillaCjsRoot = `const { createDico } = require("@dico/client");
// Dico data file is created next to your \`dico.config.json\` file
const data = require("./dico.data.json");

const { $dico, $dicoI18n } = createDico(data);

exports.$dico = $dico;
exports.$dicoI18n = $dicoI18n;
`;

export const Vite = `import { reactive } from "vue";

import { createDico } from "@dico/client";
// Dico data file is created next to your \`dico.config.json\` file
import data from "../dico.data.json";

export const { $dico, $dicoI18n } = createDico(data);

export const useDico = () => {
    return {
        $dico: $dico,
        $dicoI18n: reactive($dicoI18n)
    };
};
`;
