const fs= require('fs');

class ContenedorArchivo {

    constructor(archivo)
    {
    this.filename=archivo
    }

    save= async (producto)=>{
    try { 
        if( fs.existsSync(this.filename)){
            let result= await this.getAll()
            let lastId= result.reduce((acc, item)=> item.id>acc? acc=item.id: acc,0 )
            let newProduct={
                id: lastId+1,
                ...producto
            }
            result.push(newProduct)
            //spread operator
            await fs.promises.writeFile(this.filename, JSON.stringify(result,null,2));
        return lastId+1
        }else{
            let newProduct={
            id:1,
            ...producto
            }
        await fs.promises.writeFile(this.filename,JSON.stringify([newProduct],null,2))
            return 1
        }
    } catch (error) {
        console.log(error);
    }  
    }


    getById= async (id)=>{
        if(fs.existsSync(this.filename)){
            let result= await this.getAll()
            let producto=result.find(item => item.id == id)

            if (producto==undefined){
                producto=[null]
            }
            
            return producto
            
        }else{
            console.log("El archivo no existe")
        }
    }
  
    deleteById = async (id) => {
        if (fs.existsSync(this.filename)) {
            let result = await this.getAll()
            let largo_antes=result.length
            let nuevo=result.filter(item=>item.id!==id)
            if (nuevo.length == largo_antes) {
                console.log(`El id: ${id} no existe`)
            }
            else{
                try {
                await fs.promises.writeFile(this.filename, JSON.stringify(nuevo, null, 2))
                } catch (error) {
                console.log(error);
                }
            }            
        } else {
                console.log("El archivo no existe")
        }
    }

    deleteAll = async () => {
        if (fs.existsSync(this.filename)) {
            let n_result =[]
            try {
                await fs.promises.writeFile(this.filename, JSON.stringify(n_result, null, 2))
                } catch (error) {
                console.log(error);
            }            
        } else {
                console.log("El archivo no existe")
        }
    }



    getAll= async()=>{
        try {
            if( fs.existsSync(this.filename)){
                let result= await fs.promises.readFile(this.filename)
                return JSON.parse(result)
            }else{
            throw "No se encontro el archivo"
            }
            } catch (error) {
            console.log(error);
            }

    }

    update=async(nuevo_producto, id)=> {
        if (fs.existsSync(this.filename)) {
            console.log("Archivo existe")
            let result = await this.getAll()
            let i = result.findIndex(item => item.id == id)
            console.log(`la posición es ${i} `)
            if (i == -1) {
               console.log(`El id: ${id} no existe`)
            } else {

                let producto1=result.find(item => item.title == nuevo_producto.title)
                let producto2=result.find(item => item.thumbnail == nuevo_producto.thumbnail)
                // console.log(producto1)
                // console.log(producto2)

                if (producto1==undefined & producto2==undefined){
                    // console.log("Se cambian los valores")
                    result[i].title = nuevo_producto.title
                    result[i].price = nuevo_producto.price
                    result[i].thumbnail=nuevo_producto.thumbnail
                    // console.log(result)
                    try {
                        await fs.promises.writeFile(this.filename, JSON.stringify(result,null,2));
                    } catch (error) {
                        console.log("Error al actualizar")
                        console.log(error)
                    }
                }
                else{
                    console.log("Hay otro producto con título y URL igual, actualizar con nuevo producto")
                } 
           }
        } else {
                console.log("El archivo no existe")
        }
    }



     

}

module.exports = ContenedorArchivo