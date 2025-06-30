const form = document.getElementById('contact-form');

form.addEventListener('submit', (event) => {
	document.body.style.cursor = 'wait';
	event.preventDefault();
	const formData = new FormData(form),
		datos = Object.fromEntries(formData.entries());

	const checkboxes = form.querySelectorAll(
		'input[name="service"]:checked'
	);
	datos.service = Array.from(checkboxes)
		.map((cb) => cb.value)
		.join(',');

	addDataValue(datos);
});

function toast({
	title = '',
	message = '',
	type = 'success',
	duration = 3000,
}) {
	const main = document.getElementById('toast');
	if (main) {
		const toast = document.createElement('div');

		// Auto remove toast
		const autoRemoveId = setTimeout(function () {
			main.removeChild(toast);
		}, duration + 1000);

		// Remove toast when clicked
		toast.onclick = function (e) {
			if (e.target.closest('.toast__close')) {
				main.removeChild(toast);
				clearTimeout(autoRemoveId);
			}
		};

		const icons = {
			success: 'fas fa-check-circle',
			warning: 'fas fa-exclamation-circle',
		};
		const icon = icons[type];
		const delay = (duration / 1000).toFixed(2);

		toast.classList.add('toast', `toast--${type}`);
		toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

		toast.innerHTML = `
                    <div class="toast__icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="toast__body">
                        <h3 class="toast__title">${title}</h3>
                        <p class="toast__msg">${message}</p>
                    </div>
                    <div class="toast__close">
                        <i class="fas fa-times"></i>
                    </div>
                `;
		main.appendChild(toast);
	}
}

const apicoIntegrationId = 'Hy9INK',
	spreadSheetId = '11VevgA4keAbC6njAy88fr4fc9JSuDsVVyYU6D2YiAyg',
	sheetName = 'Contactos',
	sheetId = 0,
	API_URL = 'https://api.apico.dev/v1/',
	append_url = `${API_URL}${apicoIntegrationId}/${spreadSheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&includeValuesInResponse=true`;

function addDataValue(formData) {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			values: [
				[
					new Date().toString(),
					formData.nombre,
					formData.correo,
					formData.telefono,
					formData.service,
					formData.mensaje,
				],
			],
		}),
	};

	fetch(append_url, options)
		.then((response) => response.json())
		.then((response) => {
			document.body.style.cursor = 'default';
			form.reset();
			toast({
				title: '¡Datos enviados con éxito!',
				message:
					'Gracias por contactarte con nosotros. Hemos recibido tu información y nos pondremos en contacto a la brevedad.',
				type: 'success',
			});
		})
		.catch((err) => {
			toast({
				title: 'Ocurrió un error',
				message:
					'Hubo un problema al enviar tus datos. Por favor, intentá nuevamente en unos minutos o contactanos directamente.',
				type: 'error',
			});
		});
}
