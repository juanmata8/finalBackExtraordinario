import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { isValidDate } from "./post.ts";
import { EventsCollection } from "../db/mongo.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";

export const updateEvent = async(ctx:Context) => {
    try{
        const resul = await ctx.request.body({type:"json"})
        const {titulo, descripcion, fecha, inicio, fin, invitados, id} = await resul.value
        if(!titulo || !fecha || !inicio || !fin || !invitados || !id){ //descripcion es optativa
            ctx.response.body = "Faltan argumentos"
            ctx.response.status = 400
            throw new Error("Faltan argumentos")
        }
        if(!isValidDate(fecha)){
            ctx.response.body = "La fecha no es valida"
            ctx.response.status = 400
            throw new Error("La fecha no es valida")
        }
        if(inicio < 0 || fin < 0 || inicio > 24 || fin > 24){ //descripcion es optativa
            ctx.response.body = "La hora no es correcta"
            ctx.response.status = 400
            throw new Error("La hora no es correcta")
        }
        
        if(fin <= inicio){
            ctx.response.body = "La hora de inicio no puede ser menor que la hora de fin"
            ctx.response.status = 400
            throw new Error("La hora de inicio no puede ser menor que la hora de fin")
        }
        const find =  await EventsCollection.findOne({
            _id:new ObjectId(id)
        })
        if(!find){
            ctx.response.body = "El evento que desea actualizar no existe"
            ctx.response.status = 404
            throw new Error("El evento que desea actualizar no existe")
        }
        
        const updated = await EventsCollection.updateOne(
            {_id:find._id}, 
            {$set: {titulo, descripcion, fecha: new Date(fecha), inicio, fin, invitados}}
            )
        if(updated.modifiedCount === 0){
            ctx.response.body = "No se pudo actualizar el evento"
            ctx.response.status = 400
            throw new Error("No se pudo actualizar el evento")
        }
        const updatedEvent = await EventsCollection.findOne({_id:find._id})
        ctx.response.body = updatedEvent
        ctx.response.status = 200
        return;
        }
        catch(e){
            console.error(e)
}
}