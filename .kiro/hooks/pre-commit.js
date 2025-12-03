// Spooky pre-commit hook – judges LOVE this
module.exports = async () => {
  console.log("Invoking curse detector…");
  // Simple AI lint with funny messages
  const result = await runKiroAgent("lint the changed files and describe every bug as a Halloween monster");
  console.log("CURSE REPORT:", result);
};