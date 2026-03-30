import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useIdleTimer, workerTimers } from "react-idle-timer";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useStore from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import AppFlowStore from "@/stores/app-flow";
import FormStore from "@/stores/form";
import i18n from "@/translations";

import Button from "./Button";
import Character from "./Character";

// IDLE_RESET_TIMEOUT is set to just under the timeout to give users a prompt before app resets
const IDLE_TIMEOUT = 5 * 1000 * 60; // 5 minutes
const IDLE_RESET_TIMEOUT = 4 * 999 * 60; // 4 minutes and 59 seconds

function IdleTimer({ bgColor, buttonColor }: { bgColor?: string; buttonColor?: string }) {
    const navigate = useNavigate();
    const hasCharacter = useStore("form", "kiosk.character.name");
    const routeParams = useParams({ from: "/$flow/$id" });
    const startingScreenID = AppFlowStore.getAppFlowByHandle(
        "flow" in routeParams ? routeParams.flow : "",
    )?.starting_screen_id as string;
    const [remaining, setRemaining] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);

    const { activate, getRemainingTime, message, pause, reset } = useIdleTimer({
        crossTab: true,
        leaderElection: true,
        onActive: () => {
            setOpen(false);
        },
        onIdle: () => {
            message({ action: "RESET" }, true);
        },
        onMessage: (data) => {
            switch (data.action) {
                case "OFFLINE":
                    pause();
                    break;
                case "ONLINE":
                    setOpen(false);
                    reset();
                    break;
                case "RESET":
                    exit();
                    break;
                default:
            }
        },
        onPrompt: () => {
            setOpen(true);
        },
        promptBeforeIdle: IDLE_RESET_TIMEOUT,
        syncTimers: 200,
        timeout: IDLE_TIMEOUT,
        timers: workerTimers,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(Math.ceil(getRemainingTime() / 1000));
        }, 500);

        return () => {
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function exit() {
        setOpen(false);
        FormStore.resetRecord();

        navigate({
            params: {
                flow:
                    (routeParams && "flow" in routeParams ? routeParams.flow : "") || "",
                id: startingScreenID,
            },
            to: "/$flow/$id",
        });
    }

    const handleStillHere = () => {
        activate();
        setOpen(false);
    };

    return (
        <AlertDialog
            onOpenChange={undefined}
            open={open}
        >
            <AlertDialogContent
                className="min-w-md bg-transparent! text-white ring-0! md:min-w-lg"
                overlayStyles={{ background: bgColor || "black", opacity: 0.97 }}
                size="sm"
            >
                <AlertDialogHeader>
                    {hasCharacter && (
                        <Character character_lookup_id="character_worried" />
                    )}
                    <AlertDialogTitle className={cn("text-xl font-bold")}>
                        {i18n.t("idle_timer.title")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-white">
                        {i18n.t("idle_timer.description")}
                        <div
                            className="
                              mx-auto my-10 w-50 rounded-lg border-2 border-black bg-white
                              py-5 text-4xl font-bold text-black
                            "
                        >
                            {Math.floor(remaining / 60)}:
                            {(remaining % 60).toString().padStart(2, "0")}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mx-auto flex! items-center">
                    <Button
                        bgColor={buttonColor || "#FFFFFF"}
                        onClick={handleStillHere}
                        textColor="#000000"
                    >
                        {i18n.t("buttons.im_still_here")}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default IdleTimer;
