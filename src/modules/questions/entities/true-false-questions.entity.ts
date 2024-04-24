import { Question } from 'src/modules/questions/entities/question.entity'
import { Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class TrueFalseQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => Question, (question) => question.trueFalseQuestion, { onDelete: 'CASCADE' })
  question: Question

  @Column()
  correctAnswer: boolean
}
