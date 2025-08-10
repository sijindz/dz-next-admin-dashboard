import { BookEntry } from "../../bookEntry/components/columns"
import { Member } from "../../member/components/columns"

export type IssueBook = {
    bookEntry: BookEntry
    member: Member
    issueDate: string
    expectedReturnDate: string
    returnDate: string
    returnStatus:boolean
}