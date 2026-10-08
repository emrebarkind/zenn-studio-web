// Fails the production build when company details are missing or a bracketed
// placeholder ("[DOLDUR]", "[adres]", …) would go live. Runs as `prebuild`.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { company, companyProblems, missingCompanyFields } from "../src/content/company";

const strict = process.env.COMPANY_STRICT === "1";
const missing = missingCompanyFields(company).map((p) => `src/content/company.ts: ${p}`);
const problems = companyProblems(company).map((p) => `src/content/company.ts: ${p}`);
if (strict) problems.push(...missing);
else if (missing.length) console.warn("Uyarı — şirket bilgileri eksik (sitede gösterilmiyor):\n" + missing.map((p) => `  - ${p}`).join("\n"));

const placeholder = /\[(DOLDUR|Ticari unvan|adres|e-posta adresi|Verilerin[^\]]*)\]/i;
function scan(dir: string) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) scan(path);
    else if (/\.(tsx?|md)$/.test(name) && !/\.test\.tsx?$/.test(name)) {
      readFileSync(path, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (placeholder.test(line) && !/^\s*(\/\/|\*|\/\*)/.test(line)) problems.push(`${path}:${i + 1}: yer tutucu: ${line.trim()}`);
        });
    }
  }
}
scan("src");

if (problems.length) {
  console.error("Yayın engellendi:\n" + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(missing.length && !strict ? "Yer tutucu yok; eksik alanlar gizli." : "Şirket bilgileri tamam.");
