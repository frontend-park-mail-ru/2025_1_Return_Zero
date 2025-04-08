export const routes = {
    pageRoute: '^/(tracks|albums|artists|profile|settings|)',
    authRoute: '#(login|register)',
    logoutRoute: '/logout'
}

export function reverseRoute(route: string, params: string[]): string {
    let result = route;
    params.forEach(param => {
        result = result.replace(/\(.*?\)/i, param);
    })
    result = result.replace(/\^|\$/, '');
    return result
}