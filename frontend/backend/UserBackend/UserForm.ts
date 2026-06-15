async function fetchFromAPI(endpoint: string) {
    const response = await fetch(`/ifes/${endpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

async function sendToAPI(
    endpoint: string,
    method: "POST" | "PUT" | "DELETE",
    body?: any
) {
    const response = await fetch(`/ifes/${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

export const getSemesterList = () => fetchFromAPI("get-semester");
export const getCurrentSemester = () => fetchFromAPI("get-current-semester");
export const getSectionList = () => fetchFromAPI("get-section");
export const getFacultyList = () => fetchFromAPI("get-faculty");
export const getSubjectList = () => fetchFromAPI("get-subject");

export const insertEvaluation = (data: any) =>
    sendToAPI("insert-evaluation", "POST", data);

export const checkUserCredentials = (email: string, password: string) =>
    sendToAPI("check-user-credential", "POST", { email, password });
