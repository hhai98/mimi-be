import { Question } from 'src/modules/questions/entities/question.entity'
import { AfterInsert, AfterUpdate, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class ChoiceQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => Question, (question) => question.choiceQuestion, { onDelete: 'CASCADE' })
  question: Question

  @Column({ default: false, nullable: true })
  chooseOne: boolean

  @Column('simple-array')
  answers: string[]

  @Column('simple-array')
  correctAnswers: number[]

  @AfterInsert()
  @AfterUpdate()
  setChooseOne() {
    this.chooseOne = this.correctAnswers.length == 1
  }
}
