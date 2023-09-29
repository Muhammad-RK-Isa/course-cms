import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Sidebar } from "./sidebar"

export const MobileSidebar = () => {
    return ( 
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="p-0 h-6 w-6 md:hidden rounded-full">
                    <Menu className="h-6 w-6"/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-56">
                <Sidebar/>
            </SheetContent>
        </Sheet>
     )
}
