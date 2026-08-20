import { ResearchMonograph } from '../types';

export const RESEARCH_MONOGRAPHS: ResearchMonograph[] = [
  {
    id: 'res-bpc157',
    title: 'BPC-157: Mechanisms of Angiogenesis, Nitric Oxide Modulation, and Fibroblast Proliferation',
    slug: 'bpc-157',
    category: 'Cellular Regeneration & Angiogenesis',
    abstract: 'Body Protection Compound-157 (BPC-157) is a 15-amino acid synthetic peptide derived from gastric pentadecapeptide. In vitro and animal model investigations reveal significant upregulation of VEGF (Vascular Endothelial Growth Factor) transcription and activation of the FAK-paxillin pathway, accelerating cellular migration and tissue repair.',
    keyFindings: [
      'Induces early growth response 1 (egr-1) gene expression to stimulate angiogenesis.',
      'Sustains endothelial nitric oxide synthase (eNOS) activation during cellular hypoxia.',
      'Enhances cell survival against hydrogen peroxide oxidative challenge in tendon explants.',
      'Exhibits high biological stability in human gastric juice and enzymatic buffers without degradation.'
    ],
    molecularDetails: {
      cas: '137525-51-0',
      formula: 'C62H98N16O22',
      weight: '1419.535 g/mol',
      purity: '≥99.4% (RP-HPLC)'
    },
    reconstitutionNotes: 'Reconstitute gently with 2.0 mL Bacteriostatic Water (0.9% Benzyl Alcohol). Swirl gently without vigorous agitation. Store at 2-8°C after dilution.',
    references: [
      'Sikiric P, et al. Stable gastric pentadecapeptide BPC 157 and healing of damaged tissue. Curr Pharm Des. 2018.',
      'Chang CH, et al. The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration. J Appl Physiol. 2011.'
    ]
  },
  {
    id: 'res-tb500',
    title: 'TB-500 (Thymosin Beta-4): Actin Sequestering and Cellular Motility in Myofibrillar Repair',
    slug: 'tb-500',
    category: 'Cytoskeletal Regulation & Tissue Remodeling',
    abstract: 'Thymosin Beta-4 is the predominant G-actin sequestering peptide in mammalian cells. The synthetic fragment TB-500 encompasses the actin-binding hexapeptide motif LKKTET, which regulates actin polymerization dynamics essential for lamellipodia formation, cell motility, and wound remodeling.',
    keyFindings: [
      'Sequestering of G-actin maintains a monomer reservoir for rapid localized filament polymerization.',
      'Promotes matrix metalloproteinase (MMP-2 and MMP-9) modulation to facilitate extracellular matrix remodeling.',
      'Downregulates inflammatory cytokine cascades (TNF-α, IL-6) in endothelial inflammation models.',
      'Promotes cardiomyocyte survival and prevents apoptosis under acute ischemic challenge in laboratory models.'
    ],
    molecularDetails: {
      cas: '77591-33-4',
      formula: 'C212H350N56O78S',
      weight: '4963.49 g/mol',
      purity: '≥99.2% (HPLC/MS)'
    },
    reconstitutionNotes: 'Reconstitute with 2.0 mL sterile Bacteriostatic Water. Allow 3-5 minutes for complete dissolution at room temperature before chilling.',
    references: [
      'Goldstein AL, et al. Thymosin β4: actin-sequestering protein moonlights to repair injured tissues. Trends Mol Med. 2012.',
      'Philp D, et al. Thymosin beta4 promotes angiogenesis, wound healing, and hair follicle development. Mech Ageing Dev. 2004.'
    ]
  },
  {
    id: 'res-tirzepatide',
    title: 'Dual GIP and GLP-1 Receptor Co-Agonism: Synergistic Metabolic Regulation Mechanisms',
    slug: 'tirzepatide',
    category: 'Metabolic Endocrinology & Incretins',
    abstract: 'Tirzepatide is a synthetic peptide engineered with biased dual agonism at both glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptors. The combination creates potent synergistic insulinotropic effects while modulating white adipose tissue (WAT) lipid storage and sensitivity.',
    keyFindings: [
      'GIP receptor engagement enhances sensitivity of pancreatic beta-cells to GLP-1 signaling.',
      'Modulates hypothalamic POMC and NPY/AgRP neuronal firing to regulate central satiety setpoints.',
      'Stimulates uncoupling protein 1 (UCP-1) in brown and beige adipose tissue, elevating thermogenic energy expenditure.',
      'Significant reduction in hepatic lipid accumulation and intrahepatic triglyceride content in experimental models.'
    ],
    molecularDetails: {
      cas: '2023788-19-2',
      formula: 'C225H348N48O68',
      weight: '4813.45 g/mol',
      purity: '≥99.8% (RP-HPLC)'
    },
    reconstitutionNotes: 'Use 2.0 mL Bacteriostatic Water per 10mg or 15mg vial. Protect reconstituted peptide from direct UV sunlight. Store at 2-8°C.',
    references: [
      'Coskun T, et al. LY3298176, a novel dual GIP and GLP-1 receptor agonist for the treatment of type 2 diabetes mellitus: From discovery to clinical proof of concept. Mol Metab. 2018.',
      'Finan B, et al. Chemical Hybridization of Glucagon and GIP Produces Potent Incretin Dual Agonists. Cell Metab. 2013.'
    ]
  }
];
