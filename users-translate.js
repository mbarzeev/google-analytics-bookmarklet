(function() {
	const CLASS_ID = 'capriza-injected-id';
	const ALREADY_UPDATED = true;
	let alertThrottle = false;

	function myAlert(message) {
		if (alertThrottle) return;
		setTimeout(()=> {
			alertThrottle = false;
		}, 1500);
		alertThrottle = true;
		alert(message);
	}

	let isDev = /Dev/.test($(".ID-accounts-summary-1")[0].textContent);
	let manageUrl = isDev ? 'https://managedev.capriza.com/users/' : 'https://manage.prod.capriza.com/users/';

	if ($(`\.${CLASS_ID}`).length > 0){
		return myAlert('Already fetched user names on page, aborting');
	}
	let loggedIn = new Promise((resolve, reject)=> {
		$.ajax({
			url: `${manageUrl}2.json`,
			xhrFields: {
				withCredentials: true
			}
		}).fail((error)=> {
				let errorMessage;
				if (error.responseText){
					errorMessage = `Failed to fetch data from Capriza Manage. Error: ${JSON.parse(error.responseText).errors}`;
				} else {
					errorMessage = JSON.stringify(error);
				}
				debugger;
				console.log(errorMessage);
				myAlert(errorMessage);
				reject(errorMessage);
			})
			.done(()=> {
				resolve();
			});
	});

	function updateNodes(){
		if ($(`\.${CLASS_ID}`).length > 0){
			console.log('Page already updated');
			return ALREADY_UPDATED;
		}
		let users = $('.TARGET-app-visitors-user-activity');
		let user = $('#ID-activity-userActivityProfile').find('> div:first-child > div:last-child');
		if (user.length){
			users.push(user[0]);
		}
		users.toArray().forEach((user)=> {
			var userWasAlerted = false;
			let userId = user.textContent;
			loggedIn
				.then(()=> {
					$.ajax({
						url: `${manageUrl}${userId}.json`,
						success(result) {
							user.textContent = `${result.user.email}`;
							let span = document.createElement("span");
							span.textContent = userId;
							span.className = CLASS_ID;
							span.setAttribute("style", "color: grey; margin-left: 3px; font-size: 9px");
							user.appendChild(span);
						},
						error(error){
							if (!userWasAlerted) {
								userWasAlerted = true;
								myAlert(`Error: ${error.responseText ? error.responseText : JSON.stringify(error)}`);
								setTimeout(()=> {
									userWasAlerted = false;
								}, 3000);
							}

						},
						xhrFields: {
							withCredentials: true
						},
					})
				})
				.catch((error)=> {
					console.log(`Skipping update of user ${userId} due to error ${error}`);
				});
		});
	}

	updateNodes();

	window.addEventListener("hashchange", ()=> {
		let i = 0;
		function update(){
			if (++i < 10) {
				console.log(`trying to update nodes, iteration ${i}`);
				if (updateNodes() ==! ALREADY_UPDATED) {
					setTimeout(update, 1000);
				}
			} else {
				i = 0;
			}
		}
		update();
	});
}());
