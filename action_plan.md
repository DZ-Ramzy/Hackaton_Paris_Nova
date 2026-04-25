# AutoSwitch — Plan d'action

**Périmètre : électricité résidentielle France.**
**Horizon : J0 (hackathon) → J+90 (post-hackathon).**

---

## 1. Phase 0 — Pré-hackathon (J-3 à J0)

### 1.1 Setup environnements

- [ ] **Comptes API** créés et clés en variables d'env :
  - Anthropic (Claude Sonnet 4.5)
  - Mistral (OCR)
  - Enedis Data Connect (sandbox développeur)
  - Vapi.ai (compte trial + voix FR pré-config)
  - Twilio (SMS test)
  - Resend (email)
  - Supabase (projet créé, schéma initial)
- [ ] **Repo GitHub** prêt avec branches `main` / `dev` / `feat/*`
- [ ] **Stack base** initialisée :
  - Next.js 15 + Tailwind + shadcn
  - Mastra ou LangGraph pour orchestration
  - Drizzle ORM + Supabase Postgres
- [ ] **Compte démo Linky** : un PDL réel (Tom ou autre) avec autorisation Data Connect activée
- [ ] **Faux fournisseur cible** identifié (ex : Octopus Energy sandbox ou page test)

### 1.2 Préparation jeux de données

- [ ] 5 factures EDF réelles (anonymisées) pour entraîner l'OCR
- [ ] Tableau Excel des 10 offres marché (cf. `data.md` § 2.3) avec prix kWh + abonnement → seed DB
- [ ] Profil Linky démo : courbe de charge 30 min sur 30 jours

### 1.3 Répartition rôles équipe

| Rôle | Responsable | Stack principale |
|---|---|---|
| **Lead architecte / orchestrator** | — | Mastra/LangGraph + Claude |
| **Onboarding agent + OCR** | — | Mistral OCR + Claude Vision |
| **Watcher agent + scraping** | — | Playwright + Enedis Data Connect |
| **Decider agent + logique** | — | Claude Sonnet 4.5 prompts |
| **Executor agent + Vapi** | — | Browser-use + Vapi |
| **Front + dashboard** | — | Next.js + shadcn |
| **Pitch + démo + support** | Tom | Marp + Notion |

---

## 2. Phase 1 — Hackathon 48 h

### Jour 1 (J0)

| Tranche | Objectif | Livrable | Owner |
|---|---|---|---|
| **0–3 h** | Setup global | Repo + Next.js + Supabase + Claude API en local | Lead |
| **3–8 h** | Onboarding Agent | OCR factures EDF → JSON structuré (PDL, conso, abo, prix) | Onboarding |
| **8–14 h** | Watcher Agent | Enedis Data Connect sandbox lit conso 30 min + scraping 2 fournisseurs | Watcher |
| **14–20 h** | Decider Agent | Logique de comparaison + prompt système Claude + sortie en langage naturel | Decider |
| **20–22 h** | Sync & démo interne | Pipeline Onboard → Watcher → Decider qui tourne sur un PDL réel | All |

**Critère sortie J1** : sur upload de facture EDF, le système retourne *« passe à Primeo, économie estimée 232 €/an »* en moins de 30 secondes.

### Jour 2 (J0+1)

| Tranche | Objectif | Livrable | Owner |
|---|---|---|---|
| **0–6 h** | Executor Agent | Browser-use souscrit chez 1 fournisseur cible (mock) avec mandat SEPA | Executor |
| **6–10 h** | Vapi voix FR | Agent vocal scripté qui appelle un faux SAV et finalise une résiliation | Executor |
| **10–14 h** | Dashboard utilisateur | Front Marie : conso Linky, économies estimées, historique switches | Front |
| **14–17 h** | Pitch deck final | `slides.md` → export PDF + version Marp HTML | Tom |
| **17–20 h** | Répétitions démo | 3 répétitions chronométrées de la démo + Q&A sur slides | All |

**Critère sortie J2** : démo de 90 secondes qui marche **3 fois de suite** sans intervention humaine.

### Scope explicite : ce qui est IN / OUT pour le hackathon

**IN (must-have)**
- ✅ OCR facture EDF → JSON
- ✅ Connexion Linky démo via OAuth Enedis Data Connect
- ✅ Scraping 2-3 fournisseurs (Primeo, Octopus, TotalEnergies)
- ✅ Decider Agent qui décide + explique
- ✅ Browser-use sur 1 souscription en live
- ✅ Vapi appel vocal en français (le moment WOW)
- ✅ Dashboard avec économies cumulées
- ✅ Pitch deck 10-12 slides

**OUT (nice-to-have, post-hack)**
- ❌ Vraie intégration paiement / mandat SEPA réel (mocké via DocuSign sandbox)
- ❌ Optimisation HP/HC / Tempo (mention dans le pitch, pas codé)
- ❌ Multi-PDL / résidence secondaire
- ❌ B2G / précarité énergétique
- ❌ Gaz résidentiel
- ❌ Mode 100 % auto sans validation utilisateur
- ❌ Vraie auth utilisateurs (mock email magic link)

---

## 3. Phase 2 — Démo & pitch (présentation jury)

### 3.1 Script démo — 90 secondes chrono

| Sec | Action | Texte parlé |
|---|---|---|
| 0-10 | Upload facture EDF (PDF) | *« Marie reçoit sa facture EDF. Elle la photographie. »* |
| 10-15 | OCR live affiche PDL, conso, prix | *« 4 secondes. PDL extrait, conso 5 200 kWh. »* |
| 15-25 | Connexion Linky OAuth | *« Elle connecte son Linky. Courbe 30 min. »* |
| 25-40 | Decider parle | *« L'agent décide : Primeo Confort+, économie 245 €/an. »* |
| 40-50 | Clic « Switch » | *« Marie clique. Une seule fois. »* |
| 50-75 | Browser-use souscrit en live | *« Browser-use remplit le formulaire à sa place. »* |
| 75-90 | Vapi appelle, résilie en français | *« Et si l'opérateur exige un appel ? »* → audio Vapi live |

### 3.2 Plan B si quelque chose casse

| Composant | Risque | Plan B |
|---|---|---|
| Browser-use | Site fournisseur change UI | Vidéo pré-enregistrée 30 sec |
| Vapi | API down / latence | Audio pré-enregistré + caption |
| OCR | Facture mal lue | Facture pré-parsée en cache |
| Linky OAuth | Sandbox Enedis instable | Données stockées localement |

### 3.3 Q&A pré-préparé (top 10 questions jury)

1. **« Quelle est votre barrière à l'entrée ? »**
   → Profil de consommation Linky 30 min + re-switch continu. Selectra ne peut pas faire ça sans refondre toute son opération humaine.
2. **« Pourquoi pas Octopus / un fournisseur fait déjà du switching ? »**
   → Aucun fournisseur ne switche un client vers un concurrent. Conflit d'intérêt structurel.
3. **« Et si les fournisseurs vous bloquent ? »**
   → Vapi en fallback + diversification 5+ partenaires + roadmap API directes.
4. **« Réglementation, ORIAS ? »**
   → ORIAS pas requis pour intermédiation énergie (couvre assurance/banque). Mandat SEPA + procuration eIDAS suffit.
5. **« Comment vous acquérez vos clients ? »**
   → Démarchage tél interdit (375 k€ amende). On joue 100 % digital : SEO, partenariats banques/néobanques, bouche-à-oreille.
6. **« Pourquoi maintenant ? »**
   → Spot ×6,4 en 7 jours, 47/80 offres < TRV, Linky 97 % installé, +556 k switchers en 2025. Tout converge.
7. **« Modèle économique ? »**
   → Commission fournisseur 80 € × 1,2 switch/an = 96 € ARPU + Premium 5 €/mois.
8. **« Quel est le risque numéro 1 ? »**
   → Anti-spam fournisseur. Mitigation : cooldown 90 j codé en dur.
9. **« Pourquoi ça va marcher en France et pas ailleurs ? »**
   → Switch gratuit + sans engagement + Linky 97 % = combinaison unique. UK a le même cadre, Octopus vaut 9 Md$.
10. **« Et après l'électricité ? »**
    → Gaz résidentiel (10 M sites) → x2 TAM. Puis B2G précarité énergétique.

---

## 4. Phase 3 — Post-hackathon J+30

### 4.1 Décision GO / NO-GO (J+7)

Critères pour continuer le projet :
- [ ] Le MVP a impressionné le jury (top 3 ou prix tech)
- [ ] L'équipe est aligned pour continuer
- [ ] 10 personnes interviewées disent *« je l'utiliserais »*

### 4.2 Validation utilisateur (J+14)

- [ ] **20 interviews** semi-structurées (15 min chacune)
  - 10 jamais switché du TRV
  - 10 ayant déjà switché 1 fois
- [ ] Questions clés :
  - *« Tu paierais combien pour ça ? »*
  - *« Tu donnerais accès à ton compte Linky ? »*
  - *« Tu accepterais le mode 100 % auto ? »*
- [ ] Synthèse → décisions produit (free vs premium, opt-in vs auto par défaut)

### 4.3 Audit juridique (J+30)

- [ ] **Avocat spécialisé énergie** (1-2 séances 500-1000 €)
  - Validation mandat SEPA + procuration
  - Vérification non-besoin ORIAS
  - Cadrage CGU / CGV
- [ ] **DPO / RGPD** : audit gestion donnée Linky 30 min
- [ ] **Statut juridique** : SAS pré-bêta

---

## 5. Phase 4 — MVP v1 (J+30 à J+60)

### 5.1 Tech production

- [ ] Migration sandbox Enedis → prod (demande officielle Enedis Data Connect)
- [ ] Scraping → infrastructure dédiée (Crawlee / Apify)
- [ ] Browser-use sur 3 fournisseurs réels (pas mockés)
- [ ] Mandat SEPA + procuration via DocuSign / Yousign eIDAS qualifié
- [ ] Monitoring : Sentry + Logtail + Grafana
- [ ] Compliance : RGPD, hébergement HDS pas requis (pas santé) mais EU only

### 5.2 Partenariats

- [ ] **1er fournisseur partenaire signé** (cible : Primeo ou Mint Énergie — petits, agressifs, à la recherche de leads)
- [ ] **Contrat de commission** : 60-80 €/lead acquis
- [ ] Backup : 2 autres fournisseurs en discussion

### 5.3 Bêta privée

- [ ] **50 utilisateurs** recrutés (réseau perso + LinkedIn ciblé)
- [ ] Mode validation manuelle uniquement (pas d'auto)
- [ ] Suivi NPS hebdo
- [ ] Critère succès : **20+ switches réussis** sur 50 utilisateurs

---

## 6. Phase 5 — MVP v2 + croissance (J+60 à J+90)

### 6.1 Produit

- [ ] **Mode 100 % auto opt-in** activé (avec règles strictes)
- [ ] **Optimisation HP/HC** : recommandation basée sur 30 jours Linky
- [ ] **Alertes Tempo** pour profils flexibles
- [ ] **Multi-PDL** (résidence secondaire)
- [ ] App mobile *(nice to have, dépend ressources)*

### 6.2 Croissance

- [ ] **5 partenariats fournisseurs** signés
- [ ] **500 utilisateurs bêta** actifs
- [ ] Acquisition :
  - SEO : 10 articles long-tail (« meilleure offre élec maison 100m2 », etc.)
  - Partenariats : 1 banque/néobanque en pilote (Lydia, Revolut, Pixpay…)
  - Reddit / Twitter : présence active
- [ ] Premier ratio LTV/CAC mesuré

### 6.3 Préparation seed

- [ ] **Pitch deck investor v1** (différent du pitch hackathon, plus business)
- [ ] **Data room** : KPIs, contrats partenaires, audit juridique
- [ ] **3 angels en pré-discussion**
- [ ] Cible levée Q1 2027 : 500 k€ – 1 M€ pre-seed

---

## 7. KPIs à tracker dès J0

| Métrique | Fréquence | Cible J+90 |
|---|---|---|
| **Utilisateurs onboardés** | Hebdo | 500 |
| **Switches initiés** | Hebdo | 200 |
| **Switches finalisés** | Hebdo | 150 (75 % conversion) |
| **Économie cumulée délivrée** | Hebdo | 30 000 € |
| **NPS** | Mensuel | > 50 |
| **CAC** | Mensuel | < 25 € |
| **Taux d'opt-in mode auto** | Mensuel | > 40 % |
| **Litiges Médiateur / 100 switches** | Mensuel | 0 |

---

## 8. Décisions critiques à prendre

### 8.1 Avant le hackathon

- [ ] **Choix du framework agents** : Mastra (TypeScript-first, plus simple) vs LangGraph (Python, plus mature) ?
- [ ] **Voix Vapi vs Retell AI** : tester les deux sur 1 cas d'usage en français
- [ ] **Browser-use vs Playwright pur** : Browser-use plus moderne mais moins prévisible

### 8.2 Avant la bêta (J+30)

- [ ] **Mode auto par défaut ou opt-in ?** Insight UX : la confiance se construit avec validation manuelle d'abord
- [ ] **Free tier inclut combien de switches ?** Recommandation : 1/an
- [ ] **Premium 5 € ou 7,99 € ?** A/B test possible
- [ ] **Présence de marque sur le marché du switch** : créer une marque distincte ou rester full white-label vers les fournisseurs ?

### 8.3 Avant le seed (J+90)

- [ ] **Extension gaz : maintenant ou après seed ?** Recommandation : après seed, pour garder le focus
- [ ] **Statut juridique cible : SAS ou SCOP ?** SAS classique pour scaling
- [ ] **B2G : pivoter ou roadmap an 2 ?** Recommandation : roadmap an 2

---

## 9. Risques majeurs & mitigation continue

| Risque | Indicateur d'alerte | Mitigation |
|---|---|---|
| **Anti-spam fournisseur** | Refus de souscription d'un partenaire | Cooldown 90 j + diversification |
| **Faillite d'un fournisseur partenaire** | Carton rouge Médiateur | Monitoring santé + 5+ partenaires |
| **Régulation tarifaire qui durcit le marché** | Annonce CRE / gouvernement | Veille mensuelle + adaptation produit |
| **Blocage technique scraping** | Échec > 10 % sur un fournisseur | Vapi fallback + API directe |
| **Litige client / Médiateur** | 1 saisine | RC pro + procédure de remédiation |
| **Concurrence étrangère arrive** (Octopus/Bilt FR) | Annonce presse | Speed to market + lock partenariats |

---

## 10. Ressources / liens utiles

- **Repo GitHub** : https://github.com/MathFreedom/team_6
- **Pitch deck** : `slides.md`
- **Note de cadrage** : `text.md`
- **Recherche marché** : `data.md`
- **Enedis Data Connect Sandbox** : https://datahub-enedis.fr/data-connect/
- **Mastra docs** : https://mastra.ai
- **Browser-use** : https://github.com/browser-use/browser-use
- **Vapi.ai** : https://vapi.ai/
- **DocuSign API eIDAS** : https://developers.docusign.com
