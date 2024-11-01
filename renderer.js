const { ipcRenderer } = require('electron');

document.getElementById('browseButton').addEventListener('click', async () => {
  const filePath = await ipcRenderer.invoke('select-file');
  if (filePath) {
    document.getElementById('filePath').value = filePath;
  }
});

document.getElementById('validateButton').addEventListener('click', async () => {
  const filePath = document.getElementById('filePath').value;
  if (!filePath) {
    alert('Por favor, selecione um arquivo primeiro.');
    return;
  }

  try {
    document.getElementById('validateButton').disabled = true;
    const results = await ipcRenderer.invoke('validate-users', filePath);
    
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    
    results.forEach(result => {
      const option = document.createElement('option');
      option.text = result;
      resultsList.add(option);
    });

    document.getElementById('exportButton').disabled = results.length === 0;
  } catch (error) {
    alert(`Erro ao validar usuários: ${error.message}`);
  } finally {
    document.getElementById('validateButton').disabled = false;
  }
});

document.getElementById('exportButton').addEventListener('click', () => {
  const resultsList = document.getElementById('resultsList');
  const results = Array.from(resultsList.options).map(opt => opt.text);
  
  const csvContent = results.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Resultados_AD_Validacao.csv';
  link.click();
});