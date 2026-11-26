document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario');
    
    function validaCPF(cpf) {
        let soma = 0;
        let resto;
        const strCPF = String(cpf).replace(/\D/g, '');
        
        if (strCPF.length !== 11) return false;
        
        if ([
            '00000000000', '11111111111', '22222222222', '33333333333',
            '44444444444', '55555555555', '66666666666', '77777777777',
            '88888888888', '99999999999'
        ].indexOf(strCPF) !== -1) return false;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(strCPF.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(strCPF.substring(10, 11))) return false;

        return true;
    }

    function validaDataNascimento(input) {
        const dataValue = input.value;
        if (!dataValue) return false;

        const dataNasc = new Date(dataValue);
        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0);

        if (dataNasc > dataAtual) {
            input.style.borderColor = '#DC2626';
            alert('A data de nascimento não pode ser no futuro.');
            return false;
        }

        let idade = dataAtual.getFullYear() - dataNasc.getFullYear();
        const mesAtual = dataAtual.getMonth();
        const diaAtual = dataAtual.getDate();

        if (mesAtual < dataNasc.getMonth() || 
           (mesAtual === dataNasc.getMonth() && diaAtual < dataNasc.getDate())) {
            idade--;
        }

        if (idade < 18) {
            input.style.borderColor = '#DC2626';
            alert('Você precisa ter pelo menos 18 anos para se inscrever.');
            return false;
        }

        if (idade > 120) {
            input.style.borderColor = '#DC2626';
            alert('Data inválida. Verifique o ano digitado.');
            return false;
        }

        input.style.borderColor = '#D6D3D1';
        return true;
    }

    const inputCPF = document.getElementById('cpf');
    inputCPF.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
        } else if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{1,3}).*/, "$1.$2.$3");
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{1,3}).*/, "$1.$2");
        }
        e.target.value = value;

        if (value.length === 14) {
            inputCPF.style.borderColor = validaCPF(value) ? '#D6D3D1' : '#DC2626';
        } else {
            inputCPF.style.borderColor = '#D6D3D1';
        }
    });

    const inputData = document.getElementById('data_nascimento');
    inputData.addEventListener('blur', function() {
        if (inputData.value) validaDataNascimento(inputData);
    });

    const inputTelefone = document.getElementById('telefone');
    inputTelefone.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
        }
        e.target.value = value;
    });

    const inputEmail = document.getElementById('email');
    const spanEmail = inputEmail.nextElementSibling;
    inputEmail.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valido = emailRegex.test(inputEmail.value) || inputEmail.value === "";
        inputEmail.style.borderColor = valido ? '#D6D3D1' : '#DC2626';
        spanEmail.style.display = valido ? 'none' : 'block';
    });

    const spanTelefone = inputTelefone.nextElementSibling;
    inputTelefone.addEventListener('input', function() {
        const regexTelefone = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        const valido = regexTelefone.test(inputTelefone.value) || inputTelefone.value === "";
        inputTelefone.style.borderColor = valido ? '#D6D3D1' : '#DC2626';
        spanTelefone.style.display = valido ? 'none' : 'block';
    });

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); 

            if (!validaDataNascimento(inputData)) {
                inputData.focus();
                return;
            }

            if (!validaCPF(inputCPF.value)) {
                alert('Por favor, insira um CPF válido.');
                inputCPF.style.borderColor = '#DC2626';
                inputCPF.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(inputEmail.value)) {
                alert('Por favor, insira um e-mail válido.');
                inputEmail.focus();
                return;
            }

            const regexTelefone = /^\(\d{2}\) \d{4,5}-\d{4}$/;
            if (!regexTelefone.test(inputTelefone.value)) {
                alert('Por favor, insira um telefone válido.');
                inputTelefone.focus();
                return;
            }

            const dados = {
                name: form.elements["nomecompleto"].value,
                dataNascimento: form.elements["data_nascimento"].value,
                cpf: form.elements["cpf"].value,
                sexo: form.elements["sexo"].value,
                email: form.elements["email"].value,
                telefone: form.elements["telefone"].value,
                concordo: form.elements["concordo"].checked
            };

            console.log('Dados prontos para envio:', dados);
            alert('Formulário validado com sucesso! (Verifique o console)');
        });
    }
});