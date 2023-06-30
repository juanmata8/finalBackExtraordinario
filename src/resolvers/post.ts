import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts"
import { EventsCollection } from "../db/mongo.ts";
import { EventSchema } from "../db/schemas.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/deps.ts";

export const isValidDate = (dateString:string) => {
    return !isNaN(Date.parse(dateString));
  }

export const addEvent = async(ctx:Context):Promise<EventSchema|undefined> => {
    try{const resul = await ctx.request.body({type:"json"})
    
    const {titulo, descripcion, fecha, inicio, fin, invitados} = await resul.value
    if(!titulo || !fecha || !inicio || !fin || !invitados){ //descripcion es optativa
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
        fecha: new Date(fecha),
        $or: [
          { inicio: { $gte: inicio, $lte: fin } },
          { fin: { $gte: inicio, $lte: fin } },
        ],
      })
    if(find){
        ctx.response.body = "Ya existe un evento en esa fecha y hora"
        ctx.response.status = 400
        throw new Error("Ya existe un evento en esa fecha y hora")
    }
    const newEvent:EventSchema = {
        _id:new ObjectId(),
        titulo,
        descripcion,
        fecha: new Date(fecha), 
        inicio, 
        fin, 
        invitados
    }
    const event = await EventsCollection.insertOne(newEvent)
    if(!event){
        ctx.response.body = "No se pudo agregar el evento"
        ctx.response.status = 400
        throw new Error("No se pudo agregar el evento")
    }
    ctx.response.body = "Evento agregado correctamente"
    ctx.response.status = 200
    return;
    }catch(e){
    console.error(e)
}
}   