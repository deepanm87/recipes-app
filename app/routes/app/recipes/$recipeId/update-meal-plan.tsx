import ReactModal from "react-modal"
import { Form, Link, useActionData, data, redirect } from "react-router"
import { z } from "zod"
import { DeleteButton, ErrorMessage, IconInput, PrimaryButton } from "~/components/forms"
import { XIcon } from "~/components/icons"
import db from "~/db.server"
import { onChangeRecipe } from "~/utils/abilities.server"
import { classNames } from "~/utils/misc"
import { validateForm } from "~/utils/validation"
import { useRecipeContext } from "../$recipeId"
import { Route } from "./+types/update-meal-plan"

export default function UpdateMealPlanModel() {
    return (
        <ReactModal isOpen>
            <p>Hello</p>
        </ReactModal>
    )
}