document.getElementById('validateButton').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files.length) {
    alert('Por favor, selecione um arquivo primeiro.');
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    document.getElementById('validateButton').disabled = true;
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    
    data.results.forEach(result => {
      const option = document.createElement('option');
      option.text = result;
      resultsList.add(option);
    });

    document.getElementById('exportButton').disabled = data.results.length === 0;
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