document.addEventListener("DOMContentLoaded", () => {
    const user = "developer"
    const domain = "ronaldorios.com"

    const emailButtons = document.querySelectorAll(".email-btn")

    emailButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const email = `${user}@${domain}`;
            window.location.href = `mailto:${email}`
        })
    })
})