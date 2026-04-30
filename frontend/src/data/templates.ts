/**
 * CLINICAL CONSULTATION TEMPLATES
 * 
 * Specialty-specific structures for patient consultations.
 */

export const clinicalTemplates = {
    "General Practice": {
        chief_complaint: "Patient presents with...",
        examination: "BP: / mmHg\nPulse: bpm\nTemp: °F\nSPO2: %",
        diagnosis: "Acute...",
        notes: "Advised bed rest for 2 days. Drink plenty of fluids."
    },
    "Dentistry": {
        chief_complaint: "Toothache in...",
        examination: "Oral Hygiene: Good/Fair/Poor\nMissing Teeth: \nDecay: ",
        diagnosis: "Dental Caries / Pulpitis",
        notes: "Advised RCT / Extraction. Avoid cold food."
    },
    "Cardiology": {
        chief_complaint: "Chest pain / Breathlessness...",
        examination: "Heart Rate: \nMurmurs: \nEdema: ",
        diagnosis: "Hypertension / Ischemic Heart Disease",
        notes: "ECG requested. Advised low salt diet."
    }
};

export type Specialty = keyof typeof clinicalTemplates;
