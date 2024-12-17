
export const IsAuthenticated = async () => {
    try {
        // Fetch request to validate token
        const response = await fetch('http://localhost:8080/check-auth', {
            method: 'GET',
            credentials: 'include', // Include cookies in request
        });

        if (response.ok) {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        return false;
    }
};