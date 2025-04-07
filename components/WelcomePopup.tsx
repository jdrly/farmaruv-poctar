import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useState } from "react"

export function WelcomePopup() {
  const [open, setOpen] = useState(true)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Vítejte v aplikaci Farmářův počtář,</DialogTitle>
          <DialogDescription className="flex flex-col gap-4 text-foreground">
          <span>která vznikla jako součást diplomové práce Analýza ekonomických aspektů chovu králíků a drůbeže v malochovu na České zemědělské univerzitě v Praze, fakulta agrobiologie přírodních a potravinových zdrojů.</span> 
          <span>Tato aplikace je navržena tak, aby vám, malochovatelům králíků a drůbeže, pomohla efektivně zhodnotit ekonomickou situaci vašeho chovu. Díky kalkulačce nákladů a výnosů můžete snadno analyzovat rentabilitu svého chovu a získat podklady pro jeho optimalizaci či rozšíření. Farmářův počtář je výsledkem mé snahy propojit teoretické poznatky s praktickými potřebami chovatelů.</span>
          <span>Děkuji, že využíváte tuto aplikaci, a doufám, že vám bude užitečným pomocníkem ve vašem chovatelském úsilí.</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="text-start">
            <div className="flex flex-col w-full text-sm">
                <span>s úctou,</span>
                <span>Bc.Tomáš Drvota</span>
                <span>Autor aplikace a student České zemědělské univerzity</span>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}