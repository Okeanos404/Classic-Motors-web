function analyzeSuitability(input) {
  let score = 0;
  let notes = [];

  /* === Daily usage evaluation === */
  if (input.dailyUse) {
    if (!productData.usageProfile.daily) {
      notes.push("Motor ini tidak dirancang untuk pemakaian harian intensif.");
    } else {
      score += 1;
    }
  }

  /* === Hobby evaluation === */
  if (input.hobbyUse) {
    if (productData.usageProfile.hobby) {
      score += 2;
      notes.push("Motor ini sangat sesuai untuk penggunaan hobi dan koleksi.");
    }
  }

  /* === Budget evaluation === */
  if (input.budget > 0) {
    if (input.budget < productData.maintenance.monthlyCost) {
      notes.push("Budget perawatan berpotensi tidak mencukupi kebutuhan motor.");
    } else {
      score += 1;
    }
  } else {
    notes.push("Budget perawatan belum ditentukan.");
  }

  /* === Risk awareness === */
  productData.risks.forEach(risk => notes.push(risk));

  return {
    score,
    notes
  };
}
