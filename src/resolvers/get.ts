import { Context, RouterContext, helpers } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { EventsCollection } from "../db/mongo.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { EventSchema } from "../db/schemas.ts";

export const events = async(ctx:Context) => {
    try{
        const today = new Date()
      
        const events = await EventsCollection.find({
            fecha: { $gte: today },
        }).sort({ date: 1, startHour: 1 }).toArray()
        if(!events){
            ctx.response.body = []
            ctx.response.status = 200
            return
        }
        ctx.response.body = events
        ctx.response.status = 200
        }catch(e){
            console.error(e)
        } 
}

type getEventContext = RouterContext<
"/event/:id",
{id:string} & Record<string | number, string | undefined>, 
Record<string, any>
>
export const event = async(ctx:getEventContext) => {
    try{
        if(!ctx.params.id)throw new Error("id missing")
        const id = ctx.params.id
        const event = await EventsCollection.findOne({_id:new ObjectId(id)})
        if(!event){
            ctx.response.body = "event not found"
            ctx.response.status = 404
            throw new Error("event not found")
        }
        
        ctx.response.body = event
        ctx.response.status = 200
        return;

    }catch(e){
        console.error(e)
    }
}
