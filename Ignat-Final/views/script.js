document.getElementById('addPortfolioForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
        const response = await fetch('/portfolio', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to add object');
        }

        alert('Object successfully added');

    } catch (error) {
        console.error(error);
    }
});

document.getElementById('deletePortfolioForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const portfolioName = formData.get('portfolioName');

    try {
        const response = await fetch(`/portfolio/${encodeURIComponent(portfolioName)}`, {
            method: 'DELETE'
        });

        if (response.status === 200) {
            alert('Object deleted successfully');
        } else {
            throw new Error('Failed to delete object');
        }

    } catch (error) {
        console.error(error);
        alert('Failed to delete object');
    }
});

document.getElementById('updatePortfolioForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const portfolioName = formData.get('portfolioName');
    const newName = formData.get('newName');
    const newBody = formData.get('newBody');

    try {
        const response = await fetch(`/portfolio/${encodeURIComponent(portfolioName)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newName, newBody })
        });

        if (!response.ok) {
            throw new Error('Failed to update object');
        }

        alert('Object updated successfully');

    } catch (error) {
        console.error(error);
    }
});

function scrollToForm() {
    var formElement = document.getElementById('xdd');
    formElement.scrollIntoView({ behavior: 'smooth' });
}