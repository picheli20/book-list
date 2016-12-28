class Loader {
    private count : number = 0;

    add(){
        if(this.count == 0){
            $('#loader').removeClass('loaded');
        }
        this.count++;
    }
    remove(){
        if(this.count == 1){
            $('#loader').addClass('loaded');
        }
        this.count--;
    }
}


//Creating a singleton
let loader = new Loader();
export { loader };