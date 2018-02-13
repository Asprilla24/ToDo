export default class Api {
    static headers() {
      return {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  
    static get(route) {
      return this.xhr(route, null, 'GET');
    }
  
    static post(route, params) {
      return this.xhr(route, params, 'POST');
    }
  
    static put(route, params) {
      return this.xhr(route, params, 'PUT');
    }
  
    static delete(route, params) {
      return this.xhr(route, params, 'DELETE');
    }
  
    static xhr(route, params, verb) {
      const url = `${route}`;
      
      let options = Object.assign({
        method: verb
      }, params ? { body: JSON.stringify(params) } : null);
      
      options.headers = Api.headers();
      
      return fetch(url, options).then(response => {
        let json = response.json();
        if (response.ok) {
          return json;
        }else{
          return json.then(err => {
            throw err
          });
        }
      })
    }
  }