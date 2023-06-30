import { RouterContext } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { EventsCollection } from "../db/mongo.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

type deleteEventContext = RouterContext<
"/deleteEvent/:id",
{id:string} & Record<string | number, string | undefined>, 
Record<string, any>
>

export const deleteEvent = async(ctx:deleteEventContext) => {
    try{
        const id = ctx.params.id
        if(!id){
            ctx.response.body = "id missing"
            ctx.response.status = 400
            throw new Error("id missing")
        }
        const event = await EventsCollection.findOne({_id:new ObjectId(id)})
        if(!event){
            ctx.response.body = "event not found"
            ctx.response.status = 404
            throw new Error("event not found")
        }
        
        await EventsCollection.deleteOne({_id:event._id})
        ctx.response.body = "event deleted"
        ctx.response.status = 200

    }catch(e){
        console.error(e)
    }
}







